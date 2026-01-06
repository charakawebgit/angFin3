import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, PercentPipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface TableColumn {
    header: string;
    key: string;
    format?: 'currency' | 'percent' | 'number' | 'text';
    align?: 'left' | 'right' | 'center';
}

@Component({
    selector: 'app-table',
    imports: [LucideAngularModule, CurrencyPipe, PercentPipe, DecimalPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <!-- Header -->
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              @for (col of columns(); track col.key) {
                <th scope="col" class="px-6 py-4 font-bold tracking-wider whitespace-nowrap" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
                  {{ col.header }}
                </th>
              }
            </tr>
          </thead>
          
          <!-- Body -->
          <tbody class="divide-y divide-slate-100">
            @for (row of data(); track $index) {
              <tr class="bg-white hover:bg-slate-50/80 transition-colors group">
                @for (col of columns(); track col.key) {
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
                    @switch (col.format) {
                      @case ('currency') { {{ castToNumber(row[col.key]) | currency:'USD':'symbol':'1.0-2' }} }
                      @case ('percent') { {{ castToNumber(row[col.key]) | percent:'1.2-2' }} }
                      @case ('number') { {{ castToNumber(row[col.key]) | number:'1.0-4' }} }
                      @default { {{ row[col.key] }} }
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns().length" class="px-6 py-12 text-center text-slate-400 italic">
                  No data available
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TableComponent {
    readonly columns = input.required<TableColumn[]>();
    readonly data = input.required<Record<string, unknown>[]>();

    // Helper to avoid $any in template
    protected castToNumber(value: unknown): number {
        return Number(value);
    }
}
