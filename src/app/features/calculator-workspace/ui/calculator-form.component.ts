import { Component, input, output, ChangeDetectionStrategy, inject, signal, OnDestroy, effect, untracked, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, NonNullableFormBuilder, ValidatorFn } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';

import { CalculatorConfig, CalculatorData, FieldConfig } from '@entities/calculator/model/types';

type ControlValue = number | string | (string | number)[];

@Component({
  selector: 'app-calculator-form',
  imports: [
    LucideAngularModule,
    InputComponent,
    SelectComponent,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (formGroup(); as fg) {
      <div class="space-y-6">
        <form [formGroup]="fg" class="space-y-6">
          <div class="space-y-8">
            @for (group of groupedFields(); track group.name) {
              <div class="space-y-4">
                @if (group.name !== 'default') {
                   <div class="flex items-center gap-4">
                     <h3 class="text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">{{ group.name }}</h3>
                     <div class="h-px bg-surface-hover w-full"></div>
                   </div>
                }
                
                <div class="grid grid-cols-1 gap-5">
                  @for (field of group.fields; track field.key) {
                    <div>
                      @if (field.type === 'number') {
                        <app-input
                          [id]="field.key"
                          [label]="field.label"
                          [description]="field.description"
                          [control]="getControl(field.key)"
                          type="number"
                          [prefix]="field.prefix"
                          [suffix]="field.suffix"
                          [placeholder]="field.placeholder || ''"
                        />
                      } @else if (field.type === 'select') {
                        <app-select
                          [id]="field.key"
                          [label]="field.label"
                          [value]="getSelectValue(field.key)"
                          [options]="field.options || []"
                          (changed)="updateSelect(field.key, $event)"
                        />
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          
          <div class="flex justify-end pt-2">
            <button 
                type="button" 
                (click)="fg.reset()"
                class="text-xs font-bold text-text-muted hover:text-red-600 uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
                <lucide-icon name="trash-2" class="w-4 h-4 transition-transform group-hover:scale-110" />
                Clear Inputs
            </button>
          </div>
        </form>
      </div>
    }
  `,
  host: {
    '(window:keydown.escape)': 'handleEscape()',
    '(window:keydown.enter)': 'handleEnter($event)'
  }
})
export class CalculatorFormComponent implements OnDestroy {
  readonly config = input<CalculatorConfig>();
  readonly data = input<CalculatorData>();
  readonly valid = output<boolean>();
  readonly dataChanged = output<{ key: string; value: CalculatorData[string] }>();

  protected readonly groupedFields = computed(() => {
    const cfg = this.config();
    if (!cfg) return [];

    const groups = new Map<string, FieldConfig[]>();
    // Ensure default group exists if any field uses it or has no group
    if (cfg.fields.some(f => !f.group || f.group === 'default')) {
      groups.set('default', []);
    }

    cfg.fields.forEach(f => {
      const gName = f.group || 'default';
      if (!groups.has(gName)) groups.set(gName, []);
      groups.get(gName)!.push(f);
    });

    return Array.from(groups.entries()).map(([name, fields]) => ({ name, fields }));
  });

  protected formGroup = signal<FormGroup<Record<string, FormControl<ControlValue>>> | null>(null);

  private fb = inject(NonNullableFormBuilder);
  private sub = new Subscription();

  constructor() {
    effect((onCleanup) => {
      const cfg = this.config();
      if (!cfg) {
        untracked(() => this.formGroup.set(null));
        return;
      }

      this.createForm(cfg);

      onCleanup(() => {
        this.sub.unsubscribe();
        this.sub = new Subscription(); // Reset sub
      });
    });

    // Data Sync Effect
    effect(() => {
      const externalData = this.data();
      const fg = this.formGroup();
      if (fg && externalData) {
        untracked(() => {
          fg.patchValue(externalData, { emitEvent: false });
          this.valid.emit(fg.valid);
        });
      }
    });
  }

  private createForm(cfg: CalculatorConfig) {
    const controls: Record<string, FormControl<ControlValue>> = {};
    cfg.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initial = this.getInitialValue(field);

      if (field.type === 'select') {
        controls[field.key] = this.fb.control(String(initial), { validators });
        return;
      }

      controls[field.key] = this.fb.control(Number(initial), { validators });
    });

    const fg = this.fb.group(controls);

    const sub = fg.valueChanges.pipe(debounceTime(50)).subscribe(vals => {
      Object.keys(vals).forEach(key => {
        this.updateData(key, vals[key] as CalculatorData[string]);
      });
      this.valid.emit(fg.valid);
    });

    this.sub.add(sub);

    untracked(() => {
      this.formGroup.set(fg);
      this.valid.emit(fg.valid);
    });
  }

  private getInitialValue(field: FieldConfig): ControlValue {
    const external = untracked(() => this.data()?.[field.key]);
    if (field.type === 'select') {
      const first = field.options?.[0]?.value ?? '';
      return (external ?? field.defaultValue ?? first) as ControlValue;
    }
    return Number(external ?? field.defaultValue ?? 0);
  }

  private buildValidators(field: FieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required) validators.push(Validators.required);
    if (typeof field.min === 'number') validators.push(Validators.min(field.min));
    if (typeof field.max === 'number') validators.push(Validators.max(field.max));
    return validators;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  protected getControl(key: string): FormControl<ControlValue> {
    const fg = this.formGroup();
    return fg?.get(key) as FormControl<ControlValue>;
  }

  protected getSelectValue(key: string): string | number {
    const val = this.getControl(key).value;
    if (Array.isArray(val)) return '';
    return val;
  }

  protected updateSelect(key: string, value: string): void {
    this.getControl(key).setValue(value);
  }

  protected updateData(key: string, value: CalculatorData[string]): void {
    this.dataChanged.emit({ key, value });
  }

  protected handleEscape(): void {
    this.formGroup()?.reset();
  }

  protected handleEnter(event: Event): void {
    if (event.target instanceof HTMLTextAreaElement) return;
    (event.target as HTMLElement).blur();
  }
}
