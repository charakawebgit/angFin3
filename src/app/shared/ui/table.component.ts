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
    <div class="w-full overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <!-- Header -->
          <thead class="text-xs text-text-muted uppercase bg-surface-subtle border-b border-border-default">
            <tr>
              @for (col of columns(); track col.key) {
                <th scope="col" class="px-6 py-4 font-bold tracking-wider whitespace-nowrap" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
                  {{ col.header }}
                </th>
              }
            </tr>
          </thead>
          
          <!-- Body -->
          <tbody class="divide-y divide-surface-hover">
            @for (row of data(); track $index) {
              <tr class="bg-surface hover:bg-surface-hover transition-colors group">
                @for (col of columns(); track col.key) {
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-text-main" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
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
                <td [attr.colspan]="columns().length" class="px-6 py-12 text-center text-text-muted italic">
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
