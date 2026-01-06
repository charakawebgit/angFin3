import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-select',
    imports: [LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="space-y-1.5 flex flex-col w-full">
      @if (label()) {
        <label
          [for]="id()"
          class="text-sm font-medium ml-1 text-text-main"
        >
          {{ label() }}
        </label>
      }
      <div class="relative group">
        <select
          [id]="id()"
          [value]="value()"
          (change)="onValueChange($event)"
          class="w-full h-10 px-4 py-2 bg-surface border border-border-default rounded-lg text-sm text-text-main font-medium shadow-sm outline-none appearance-none transition-all cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary hover:bg-surface-hover"
        >
          @for (option of options(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        
        <!-- Chevron Icon -->
        <div
          class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-text-muted group-focus-within:text-primary"
        >
          <lucide-icon name="chevron-down" class="w-4 h-4" />
        </div>
      </div>
    </div>
  `
})
export class SelectComponent {
    readonly id = input.required<string>();
    readonly label = input<string>('');
    readonly value = input.required<string | number>();
    readonly options = input.required<{ label: string; value: string | number }[]>();

    readonly changed = output<string>();

    protected onValueChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.changed.emit(select.value);
    }
}
