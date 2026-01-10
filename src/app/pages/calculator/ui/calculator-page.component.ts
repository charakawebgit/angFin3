import { Component, computed, input, ChangeDetectionStrategy, linkedSignal, inject, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

import { CalculatorData } from '@entities/calculator/model/types';
import { CalculatorFormComponent } from '@features/calculator-workspace/ui/calculator-form.component';
import { CalculatorResultsComponent } from '@features/calculator-workspace/ui/calculator-results.component';
import { CalculatorInfoComponent } from '@features/calculator-workspace/ui/calculator-info.component';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { form, required, min, max } from '@angular/forms/signals';

@Component({
  selector: 'app-calculator-page',
  imports: [
    LucideAngularModule,
    RouterLink,
    CalculatorFormComponent,
    CalculatorResultsComponent,
    CalculatorInfoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config(); as cfg) {
      <div class="w-full max-w-[1920px] mx-auto animate-in fade-in duration-700">
        <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
           <div class="w-full lg:w-[450px] xl:w-[500px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-10 flex flex-col">
              <div class="p-6 lg:p-8 grow">
                 <div class="space-y-8">
                   <div class="mb-6">
                      <a routerLink="/" class="grow flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest mb-4 transition-colors">
                        Directory
                      </a>
                      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ cfg.title }}</h1>
                      <p class="text-slate-500 mt-1 text-sm">{{ cfg.subtitle }}</p>
                   </div>

                   <app-calculator-form 
                     [config]="cfg" 
                     [formModel]="formModel" 
                   />
                 </div>
              </div>
           </div>

           <div class="grow bg-surface-subtle p-6 lg:p-8 overflow-y-auto">
             <div class="max-w-5xl mx-auto space-y-8">
               <app-calculator-results 
                 [config]="cfg" 
                 [results]="results()" 
                 [isValid]="isValid()" 
               />
               <app-calculator-info [config]="cfg" />
             </div>
           </div>
        </div>

        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border-default shadow-2xl h-20 safe-area-bottom px-4">
             <app-calculator-results 
               [config]="cfg" 
               [results]="results()" 
               [isValid]="isValid()"
               viewMode="compact"
             />
        </div>
      </div>
    }
  `,
})
export class CalculatorPageComponent {
  readonly id = input<string>();
  private readonly calculatorService = inject(CalculatorService);

  // 1. Config derived from ID
  protected readonly config = computed(() => {
    const id = this.id();
    return id ? this.calculatorService.getById(id) : undefined;
  });

  // 2. Data model (writable) linked to config
  protected readonly data = linkedSignal<CalculatorData>(() => {
    const cfg = this.config();
    if (!cfg) return {};
    const initialData: CalculatorData = {};
    for (const field of cfg.fields) {
      initialData[field.key] = field.defaultValue as CalculatorData[string];
    }
    return initialData;
  });

  // 3. Form model initialized in constructor context (injection context safe)
  protected readonly formModel = form(this.data, (schema) => {
    const cfg = this.config();
    if (!cfg) return;

    const controls = schema as Record<string, unknown>;
    cfg.fields.forEach(f => {
      const field = controls[f.key] as any;
      if (!field) return;
      if (f.required) required(field);
      if (typeof f.min === 'number') min(field, f.min);
      if (typeof f.max === 'number') max(field, f.max);
    });
  });

  // 4. Manual validity aggregation
  protected readonly isValid = computed(() => {
    const cfg = this.config();
    const f = this.formModel as Record<string, any>;
    if (!cfg || !f) return false;

    return cfg.fields.every(field => {
      const ctrl = f[field.key];
      return ctrl && typeof ctrl.valid === 'function' ? ctrl.valid() : true;
    });
  });

  // 5. Results computed from data model
  protected readonly results = computed(() => {
    const cfg = this.config();
    const valid = this.isValid();
    if (!cfg || !valid) return [];

    const currentData = this.data();
    return cfg.results.map((res: any) => {
      try {
        const val = res.calculate(currentData);
        return typeof val === 'number' && (isNaN(val) || !isFinite(val)) ? 0 : val;
      } catch {
        return 0;
      }
    });
  });

  constructor() {
    effect(() => {
      const cfg = this.config();
      if (cfg) this.calculatorService.setActive(cfg);
      else this.calculatorService.clearActive();
    });
  }
}
