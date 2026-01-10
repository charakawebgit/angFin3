import { Component, input, output, ChangeDetectionStrategy, effect, computed, linkedSignal, untracked } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';
import { form, required, min, max, FormValueControl } from '@angular/forms/signals';

import { CalculatorConfig, CalculatorData, FieldConfig } from '@entities/calculator/model/types';

@Component({
  selector: 'app-calculator-form',
  imports: [
    LucideAngularModule,
    InputComponent,
    SelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (formResult(); as f) {
      <div class="space-y-6">
        <form class="space-y-6">
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
                      @let control = getControl(f, field.key);
                      @if (field.type === 'number' && control) {
                        <app-input
                          [id]="field.key"
                          [label]="field.label"
                          [description]="field.description"
                          [control]="control"
                          type="number"
                          [placeholder]="field.placeholder || ''"
                          [prefix]="field.prefix"
                          [suffix]="field.suffix"
                        />
                      } @else if (field.type === 'select' && control && field.options) {
                        <app-select
                           [id]="field.key"
                           [label]="field.label"
                           [control]="control"
                           [options]="field.options"
                        />
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </form>
      </div>
    }
  `
})
export class CalculatorFormComponent {
  readonly config = input.required<CalculatorConfig>();
  readonly data = input.required<CalculatorData>();

  readonly dataChanged = output<{ key: string; value: CalculatorData[string] }>();
  readonly valid = output<boolean>();

  protected readonly groupedFields = computed(() => {
    const fields = this.config().fields;
    const groups: { name: string; fields: FieldConfig[] }[] = [];

    // Group fields by 'group' property
    const grouped = new Map<string, FieldConfig[]>();
    fields.forEach(f => {
      const g = f.group || 'default';
      if (!grouped.has(g)) grouped.set(g, []);
      grouped.get(g)?.push(f);
    });

    // Default first, then others
    if (grouped.has('default')) {
      groups.push({ name: 'default', fields: grouped.get('default')! });
      grouped.delete('default');
    }

    grouped.forEach((fs, name) => groups.push({ name, fields: fs }));
    return groups;
  });

  // Create the form model source derived from input data
  private readonly modelSource = linkedSignal({
    source: this.data,
    computation: (d) => d
  });

  // Create the form with dynamic validators
  protected readonly formResult = computed(() => {
    return form(this.modelSource, (schema) => {
      const fields = this.config().fields;
      const controls = schema as Record<string, unknown>;

      fields.forEach(f => {
        const field = controls[f.key] as Parameters<typeof required>[0];

        if (f.required) {
          required(field);
        }
        if (typeof f.min === 'number') {
          min(field as Parameters<typeof min>[0], f.min);
        }
        if (typeof f.max === 'number') {
          max(field as Parameters<typeof max>[0], f.max);
        }
      });
    });
  });

  constructor() {
    // Track form invalid state
    effect(() => {
      const f = this.formResult();
      if (f && typeof (f as any).valid === 'function') {
        this.valid.emit((f as any).valid());
      }
    });

    // Check for changes in the model and emit them
    effect(() => {
      const val = this.modelSource();
      untracked(() => {
        Object.keys(val).forEach(key => {
          if (this.oldVal[key] !== (val as any)[key]) {
            this.dataChanged.emit({ key, value: (val as any)[key] });
          }
        });
        this.oldVal = JSON.parse(JSON.stringify(val));
      });
    });
  }

  // Helper for tracking previous value
  private oldVal: any = {};

  protected getControl(formGroup: any, key: string): FormValueControl<any> | undefined {
    return formGroup[key];
  }
}
