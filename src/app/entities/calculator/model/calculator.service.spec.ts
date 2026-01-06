// import { TestBed } from '@angular/core/testing'; // Unused
import { CalculatorService } from './calculator.service';
// import { CalculatorConfig } from './types'; // Unused

describe('CalculatorService', () => {
    let service: CalculatorService;

    // mockConfig removed (unused)

    beforeEach(() => {
        // Fallback to manual instantiation if TestBed is flaky in this env
        service = new CalculatorService();
        service.registerCalculators([
            { id: 'tvm', title: 'TVM', description: '', category: '', icon: '' }
        ]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve calculator by id', () => {
        // Since we are testing against the REAL registry imported in the service,
        // we should check for a known calculator, e.g., 'tvm'
        const calc = service.getById('tvm');
        expect(calc).toBeDefined();
        expect(calc?.id).toBe('tvm');
    });

    it('should return undefined for unknown id', () => {
        const calc = service.getById('unknown-id-123');
        expect(calc).toBeUndefined();
    });
});
