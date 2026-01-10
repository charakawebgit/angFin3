import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';
import { FormValueControl } from '@angular/forms/signals';

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
    @if (formModel()) {
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
                    @let control = getControl(formModel(), field.key);
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
  readonly formModel = input.required<any>(); // FormModel types are internal

  protected readonly groupedFields = computed(() => {
    const fields = this.config().fields;
    const groups: { name: string; fields: FieldConfig[] }[] = [];

    const grouped = new Map<string, FieldConfig[]>();
    fields.forEach(f => {
      const g = f.group || 'default';
      if (!grouped.has(g)) grouped.set(g, []);
      grouped.get(g)?.push(f);
    });

    if (grouped.has('default')) {
      groups.push({ name: 'default', fields: grouped.get('default')! });
      grouped.delete('default');
    }

    grouped.forEach((fs, name) => groups.push({ name, fields: fs }));
    return groups;
  });

  protected getControl(formGroup: any, key: string): FormValueControl<any> | undefined {
    return formGroup?.[key];
  }
}
