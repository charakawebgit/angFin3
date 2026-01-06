import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, PercentPipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TableComponent } from '@shared/ui/table.component';
import { CalculatorConfig, ResultValue } from '@entities/calculator/model/types';
// Utilities for template casting
const castToNumber = (val: unknown): number => Number(val);
const castToArray = (val: unknown): Record<string, unknown>[] => Array.isArray(val) ? val as Record<string, unknown>[] : [];

@Component({
  selector: 'app-calculator-results',
  imports: [LucideAngularModule, TableComponent, CurrencyPipe, PercentPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="space-y-6">
        <div class="flex items-center gap-4">
           <h3 class="text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">
             {{ config().results[0]?.label || 'Analysis Results' }}
           </h3>
           <div class="h-px bg-border-default w-full"></div>
        </div>

        <div class="flex flex-col h-full text-left">
          @if (isValid()) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 w-full animate-in fade-in slide-in-from-left-4 duration-500">
              @for (res of config().results; track res.label) {
                @let val = castToNumber(results()[$index]);
                 
                <!-- Only show scalar results in this grid, tables handles separately -->
                @if (res.type !== 'table') {
                  <div class="relative w-full group flex flex-col gap-2 p-4 rounded-xl hover:bg-surface-hover transition-all border border-transparent hover:border-border-default">
                      <div class="flex items-center justify-between">
                         <p class="text-xs font-semibold uppercase tracking-wider text-text-muted">{{ res.label }}</p>
                         <button 
                           (click)="copyToClipboard(results()[$index], res.label)"
                           class="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary"
                           [title]="'Copy ' + res.label"
                         >
                            @if (copiedField() === res.label) {
                                <lucide-icon name="check" class="w-3.5 h-3.5 text-primary" />
                            } @else {
                                <lucide-icon name="copy" class="w-3.5 h-3.5" />
                            }
                         </button>
                      </div>

                      <div class="flex items-center gap-3">
                         <span class="text-3xl font-bold tracking-tight text-text-main">
                          @switch (res.type) {
                            @case ('currency') { {{ val | currency:'USD':'symbol':'1.0-2' }} }
                            @case ('percent') { {{ val | percent:'1.2-2' }} }
                            @default { {{ val | number:'1.0-4' }} }
                          }
                        </span>
                      </div>
    
                      @if (res.type === 'percent') {
                        <div class="mt-1 w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                          <div 
                            class="h-full rounded-full transition-all duration-1000 ease-out bg-primary"
                            [style.width]="getProgressBarWidth(results()[$index])"
                          ></div>
                        </div>
                      }
                  </div>
                }
              }
            </div>
              
              <!-- Table Results take full width below -->
              @for (res of config().results; track res.label) {
                @if (res.type === 'table' && res.tableConfig) {
                  <div class="w-full mt-8 pt-6 border-t border-border-default animate-in fade-in duration-700">
                    <h3 class="text-sm font-bold text-text-main mb-4">{{ res.label }}</h3>
                    @let tableData = castToArray(results()[$index]);
                    <app-table [columns]="res.tableConfig.columns" [data]="tableData" />
                  </div>
                }
              }
          } @else {
            <!-- Empty State -->
            <div class="text-text-muted space-y-4 py-12 w-full flex flex-col items-center justify-center text-center">
               <div class="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center border border-border-default mb-2">
                <lucide-icon [name]="config().icon" class="w-8 h-8 text-text-muted opacity-50" />
              </div>
              <div class="space-y-1">
                <p class="text-base font-semibold text-text-main">Awaiting Input</p>
                <p class="text-sm text-text-muted">Adjust the parameters to generate a report.</p>
              </div>
            </div>
          }
        </div>
      </div>
  `
})
export class CalculatorResultsComponent {
  config = input.required<CalculatorConfig>();
  results = input.required<ResultValue[]>();
  isValid = input.required<boolean>();

  copiedField = signal<string | null>(null);

  protected castToNumber = castToNumber;
  protected castToArray = castToArray;

  async copyToClipboard(value: ResultValue, fieldId: string) {
    const text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');

    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback or explicit ignore
      }

      this.copiedField.set(fieldId);
      setTimeout(() => this.copiedField.set(null), 2000);
    } catch (error: unknown) {
      console.error('Copy failed', error);
    }
  }

  getProgressBarWidth(value: ResultValue): string {
    const numValue = Number(value as number);
    if (isNaN(numValue)) return '0%';
    const clamped = Math.min(Math.max(numValue * 100, 0), 100); // Percent value is usually 0.05 for 5%
    return `${clamped} % `;
  }
}
