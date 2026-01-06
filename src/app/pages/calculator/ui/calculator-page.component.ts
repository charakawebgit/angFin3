import { Component, computed, signal, input, ChangeDetectionStrategy, linkedSignal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

import { CalculatorData } from '@entities/calculator/model/types';
import { CalculatorFormComponent } from '@features/calculator-workspace/ui/calculator-form.component';
import { CalculatorResultsComponent } from '@features/calculator-workspace/ui/calculator-results.component';
import { CalculatorInfoComponent } from '@features/calculator-workspace/ui/calculator-info.component';
import { CALCULATOR_REGISTRY } from '@entities/calculator/model/registry';


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
    @if (config()) {
      <div class="w-full max-w-[1920px] mx-auto animate-in fade-in duration-700">
        
        <!-- Desktop: Split Pane Layout -->
        <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
           
           <!-- Left Pane: Inputs -->
           <!-- Sticky behavior on desktop handled by class adjustment if needed, but for now simple flex -->
           <div class="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-10 flex flex-col">
              
              <div class="p-6 lg:p-8 flex-grow">
                 <div class="space-y-8">
                   <div class="mb-6">
                      <a routerLink="/" class="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest mb-4 transition-colors">
                        <lucide-icon name="arrow-left" class="w-3.5 h-3.5 mr-1" />
                        Directory
                      </a>
                      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ config()?.title }}</h1>
                      <p class="text-slate-500 mt-1 text-sm">{{ config()?.subtitle }}</p>
                   </div>

                   <app-calculator-form 
                     [config]="config()!" 
                     [data]="data()" 
                     (valid)="setValid($event)"
                     (dataChanged)="updateData($event.key, $event.value)" 
                   />
                 </div>
              </div>
           </div>

           <!-- Right Pane: Results -->
           <div class="flex-grow bg-slate-50 p-6 lg:p-8 overflow-y-auto">
             <div class="max-w-5xl mx-auto space-y-8">
               <app-calculator-results 
                 [config]="config()!" 
                 [results]="results()" 
                 [isValid]="isValid()" 
               />
               
               <app-calculator-info [config]="config()!" />
             </div>
           </div>

        </div>

        <!-- Mobile Sticky Result Bar -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-2xl h-20 safe-area-bottom px-4">
             <app-calculator-results 
               [config]="config()!" 
               [results]="results()" 
               [isValid]="isValid()"
               viewMode="compact"
             />
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-50">
        <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
            <lucide-icon name="search-x" class="w-10 h-10 text-slate-300" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">Calculator Not Found</h2>
          <p class="text-slate-500">The tool you are looking for doesn't seem to exist.</p>
        </div>
        <a routerLink="/" class="px-6 h-12 inline-flex items-center justify-center bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
          Return to Directory
        </a>
      </div>
    }
  `,
})
export class CalculatorPageComponent {
  // Route input binding
  readonly id = input<string>();

  protected readonly isValid = signal(false);

  // Derived state from ID: Find config from registry
  protected readonly config = computed(() => {
    const id = this.id();
    if (!id) return undefined;
    
    return CALCULATOR_REGISTRY.find(c => c.id === id);
  });

  // State - Initialize with default values from config
  protected readonly data = linkedSignal<CalculatorData>(() => {
    const cfg = this.config();
    if (!cfg) return {};
    
    const initialData: CalculatorData = {};
    for (const field of cfg.fields) {
      initialData[field.key] = field.defaultValue as CalculatorData[string];
    }
    return initialData;
  });

  protected readonly results = computed(() => {
    const cfg = this.config();

    // If config is missing or form is invalid, return empty results
    if (!cfg || !this.isValid()) {
      return [];
    }

    try {
      // Evaluate all results
      return cfg.results.map((res) => {
        try {
          const result = res.calculate(this.data());
          // Validate result is not NaN or Infinity
          if (typeof result === 'number' && (isNaN(result) || !isFinite(result))) {
            return 0;
          }
          return result;
        } catch (error) {
          console.warn(`Calculation error for ${res.label}:`, error);
          return 0; // Fallback for calculation error
        }
      });
    } catch (error) {
      console.error('Results computation error:', error);
      return [];
    }
  });

  protected updateData(key: string, value: CalculatorData[string]): void {
    this.data.update(d => ({ ...d, [key]: value }));
  }

  protected setValid(v: boolean): void {
    this.isValid.set(v);
  }
}
