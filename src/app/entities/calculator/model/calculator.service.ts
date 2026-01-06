import { Injectable, signal } from '@angular/core';
import { CalculatorConfig, CalculatorDef } from './types';
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

    setActive(config: CalculatorConfig): void {
        this._activeConfig.set(config);
    }

    clearActive(): void {
        this._activeConfig.set(null);
    }

    getById(id: string): CalculatorConfig | undefined {
        return CALCULATOR_REGISTRY.find(c => c.id === id);
    }

    getAll(): readonly CalculatorConfig[] {
        return CALCULATOR_REGISTRY;
    }
}
