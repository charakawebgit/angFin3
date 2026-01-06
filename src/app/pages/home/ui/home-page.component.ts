import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CALCULATOR_REGISTRY } from '@entities/calculator/model/registry';

@Component({
    selector: 'app-home-page',
    imports: [RouterLink, FormsModule, LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      <!-- Hero Section -->
      <section class="bg-white border-b border-slate-200 px-6 py-16 lg:py-24 text-center relative overflow-hidden">
        <div class="max-w-3xl mx-auto relative z-10 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
             <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             v2.0 Professional
          </div>
          <h1 class="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
            Advanced Financial <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Analytics</span>
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Professional-grade valuation models, risk metrics, and portfolio analysis tools. 
            Designed for high-precision financial decision making.
          </p>

          <!-- Search Bar -->
          <div class="relative max-w-lg mx-auto mt-8 group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <lucide-icon name="search" class="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              [(ngModel)]="searchQuery"
              type="text" 
              placeholder="Search calculators (e.g. 'WACC', 'Black-Scholes')..." 
              class="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all hover:border-slate-300"
            />
          </div>
        </div>
        
        <!-- Background Decor -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
           <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
           <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        </div>
      </section>

      <!-- Calculator Grid -->
      <div class="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        <!-- Categories -->
        <div class="flex flex-wrap gap-2 justify-center mb-12">
           <button 
             class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
             [class]="activeCategory() === 'All' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
             (click)="activeCategory.set('All')"
           >
             All Tools
           </button>
           @for (cat of categories(); track cat) {
             <button 
               class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
               [class]="activeCategory() === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
               (click)="activeCategory.set(cat)"
             >
               {{ cat }}
             </button>
           }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (calc of filteredCalculators(); track calc.id) {
            <a 
              [routerLink]="['/calculator', calc.id]"
              class="group relative flex flex-col p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                </div>
                <!-- Badge if needed -->
              </div>
              
              <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{{ calc.title }}</h3>
              <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">{{ calc.description }}</p>

              <div class="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors mt-auto">
                 Open Tool <lucide-icon name="arrow-right" class="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          } @empty {
             <div class="col-span-full text-center py-20 text-slate-400">
               <lucide-icon name="search-x" class="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p class="text-lg font-medium">No results found for "{{ searchQuery() }}"</p>
             </div>
          }
        </div>
      </div>
    </div>
  `
})
export class HomePageComponent {
    protected readonly searchQuery = signal('');
    protected readonly activeCategory = signal('All');

    // Load registry
    private readonly calculators = signal(CALCULATOR_REGISTRY);

    protected readonly categories = computed(() => {
        const cats = new Set(this.calculators().map(c => c.category));
        return Array.from(cats).sort();
    });

    protected readonly filteredCalculators = computed(() => {
        const q = this.searchQuery().toLowerCase();
        const cat = this.activeCategory();

        return this.calculators().filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
            const matchesCat = cat === 'All' || c.category === cat;
            return matchesSearch && matchesCat;
        });
    });
}
