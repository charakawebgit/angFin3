import { describe, it, expect } from 'vitest';
import { calculateFutureValue, calculatePresentValue, calculateNpv, calculateIrr } from './investment.utils';

describe('Investment Utils', () => {
    describe('Time Value of Money', () => {
        it('should calculate Future Value (FV) correctly', () => {
            // PV = 1000, r = 0.05, n = 10
            const fv = calculateFutureValue({ pv: 1000, rate: 0.05, periods: 10 });
            expect(fv).toBeCloseTo(1628.89, 2);
        });

        it('should calculate Present Value (PV) correctly', () => {
            // FV = 1628.89, r = 0.05, n = 10
            const pv = calculatePresentValue({ fv: 1628.89, rate: 0.05, periods: 10 });
            expect(pv).toBeCloseTo(1000.00, 2);
        });

        it('should calculate NPV correctly', () => {
            const npv = calculateNpv({
                initialInvestment: 100,
                discountRate: 0.1,
                cashFlows: [10, 60, 80]
            });
            // 10/1.1 + 60/1.21 + 80/1.331 - 100
            // 9.09 + 49.59 + 60.10 - 100 = ~18.78
            expect(npv).toBeCloseTo(18.78, 2);
        });

        it('should calculate IRR correctly', () => {
            // Simple case: Invest 100, get 110 in 1 year -> 10%
            const irr = calculateIrr({ cashFlows: [-100, 110] });
            expect(irr).toBeCloseTo(0.1, 4);
        });
    });
});
