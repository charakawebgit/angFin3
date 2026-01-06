import { describe, it, expect } from 'vitest';
import { calculateAmortization, calculateCapRate } from './real-estate.utils';

describe('Real Estate Utils', () => {
    describe('Amortization', () => {
        it('should calculate monthly payment correctly', () => {
            // 100k loan, 5% interest, 30 years
            const result = calculateAmortization({ loanAmount: 100000, interestRate: 0.05, loanTerm: 30 });
            // Expected PMT ~ 536.82
            expect(result.summary.monthlyPayment).toBeCloseTo(536.82, 2);
            expect(result.summary.totalInterest).toBeCloseTo(93255.78, 0); // Approx check
        });

        it('should generate schedule', () => {
            const result = calculateAmortization({ loanAmount: 100000, interestRate: 0.05, loanTerm: 30 });
            expect(result.schedule).toBeDefined();
            expect(result.schedule?.length).toBe(360);
            expect(result.schedule?.[359].balance).toBeCloseTo(0, 1);
        });
    });

    describe('Cap Rate', () => {
        it('should calculate cap rate correctly', () => {
            // NOI = 10k, Value = 100k -> 10%
            const cr = calculateCapRate({ noi: 10000, propertyValue: 100000 });
            expect(cr).toBeCloseTo(0.10, 4);
        });
    });
});
