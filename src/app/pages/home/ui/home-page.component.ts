import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { form, Field } from '@angular/forms/signals';
import { CALCULATOR_REGISTRY } from '@entities/calculator/model/registry';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, LucideAngularModule, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface-subtle font-sans text-text-main selection:bg-primary/10 selection:text-primary">
      
      <!-- Hero Section -->
      <section class="bg-surface border-b border-border-default px-6 py-16 lg:py-24 text-center relative overflow-hidden">
        <div class="max-w-3xl mx-auto relative z-10 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-surface-hover border border-border-default rounded-full text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
             <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             v2.0 Professional
          </div>
          <h1 class="text-4xl lg:text-6xl font-black tracking-tight text-text-main mb-4">
            Advanced Financial <span class="bg-clip-text text-transparent bg-linear-to-r from-primary to-primary-hover">Analytics</span>
          </h1>
          <p class="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Professional-grade valuation models, risk metrics, and portfolio analysis tools. 
            Designed for high-precision financial decision making.
          </p>

          <!-- Search Bar -->
          <div class="relative max-w-lg mx-auto mt-8 group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <lucide-icon name="search" class="w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              [field]="searchForm.query"
              type="text" 
              placeholder="Search calculators (e.g. 'WACC', 'Black-Scholes')..." 
              class="w-full h-14 pl-12 pr-4 bg-surface border border-border-default rounded-2xl shadow-sm text-base font-medium placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all hover:border-text-muted"
            />
          </div>
        </div>
        
        <!-- Background Decor -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
           <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
           <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-hover/10 rounded-full blur-3xl opacity-60"></div>
        </div>
      </section>

      <!-- Calculator Grid -->
      <div class="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        <!-- Categories -->
        <div class="flex flex-wrap gap-2 justify-center mb-12">
           <button 
             class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
             [class]="activeCategory() === 'All' 
                ? 'bg-text-main text-primary-foreground border-text-main shadow-md transform scale-105' 
                : 'bg-surface text-text-muted border-border-default hover:border-text-muted hover:bg-surface-hover'"
             (click)="activeCategory.set('All')"
           >
             All Tools
           </button>
           @for (cat of categories(); track cat) {
             <button 
               class="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
               [class]="activeCategory() === cat 
                  ? 'bg-text-main text-primary-foreground border-text-main shadow-md transform scale-105' 
                  : 'bg-surface text-text-muted border-border-default hover:border-text-muted hover:bg-surface-hover'"
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
              class="group relative flex flex-col p-6 bg-surface rounded-2xl border border-border-default hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-hover flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                </div>
                <!-- Badge if needed -->
              </div>
              
              <h3 class="text-lg font-bold text-text-main mb-2 group-hover:text-primary transition-colors">{{ calc.title }}</h3>
              <p class="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4 grow">{{ calc.description }}</p>

              <div class="flex items-center text-xs font-bold text-text-muted uppercase tracking-wider group-hover:text-primary transition-colors mt-auto">
                 Open Tool <lucide-icon name="arrow-right" class="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          } @empty {
             <div class="col-span-full text-center py-20 text-text-muted">
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
  protected readonly searchState = signal({ query: '' });
  protected readonly searchForm = form(this.searchState) as any;

  protected readonly searchQuery = computed(() => this.searchForm.query.value());
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
