import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorConfig } from '@entities/calculator/model/types';

@Component({
    selector: 'app-calculator-info',
    imports: [LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="w-full bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-6">
      
      <!-- Description -->
      <div class="space-y-2">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
           <lucide-icon name="book-open" class="w-4 h-4 text-slate-400" />
           Overview
        </h4>
        <p class="text-sm text-slate-600 leading-relaxed max-w-prose">
          {{ config().description }}
        </p>
      </div>

      <!-- Insights -->
      @if (config().insights) {
        <div class="space-y-2">
           <h4 class="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
             <lucide-icon name="lightbulb" class="w-4 h-4 text-amber-500" />
             Insights
           </h4>
           <div class="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             {{ config().insights }}
           </div>
        </div>
      }

      <!-- Formula -->
      @if (config().formula) {
        <div class="space-y-2">
           <h4 class="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
             <lucide-icon name="function-square" class="w-4 h-4 text-blue-500" />
             Formula
           </h4>
           <div class="font-mono text-sm bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto shadow-inner">
             {{ config().formula }}
           </div>
        </div>
      }

    </div>
  `
})
export class CalculatorInfoComponent {
    config = input.required<CalculatorConfig>();
}
