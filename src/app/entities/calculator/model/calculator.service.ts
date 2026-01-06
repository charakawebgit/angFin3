import { Injectable, signal, computed } from '@angular/core';
import { CalculatorConfig } from './types';
import { CALCULATOR_REGISTRY } from './registry';

/**
 * Service for managing calculator state.
 * Note: Calculator definitions are statically imported from the registry.
 * This service manages the active calculator state only.
 */
@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    // Active calculator state
    private readonly _activeConfig = signal<CalculatorConfig | null>(null);
    readonly activeConfig = this._activeConfig.asReadonly();

    // Registry as signal for reactivity
    private readonly _registry = signal<readonly CalculatorConfig[]>(CALCULATOR_REGISTRY);
    readonly registry = this._registry.asReadonly();

    // Computed derived state
    readonly hasActiveCalculator = computed(() => this._activeConfig() !== null);
    readonly activeCalculatorId = computed(() => this._activeConfig()?.id ?? null);

    // Computed views
    readonly calculatorsByCategory = computed(() => {
        const configs = this._registry();
        const groups = new Map<string, CalculatorConfig[]>();

        for (const config of configs) {
            const category = config.category || 'Other';
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category)!.push(config);
        }

        return Array.from(groups.entries()).map(([category, calculators]) => ({
            category,
            calculators: calculators.sort((a, b) => a.title.localeCompare(b.title))
        })).sort((a, b) => a.category.localeCompare(b.category));
    });

    setActive(config: CalculatorConfig): void {
        this._activeConfig.set(config);
    }

    clearActive(): void {
        this._activeConfig.set(null);
    }

    getById(id: string): CalculatorConfig | undefined {
        return this._registry().find(c => c.id === id);
    }
}
