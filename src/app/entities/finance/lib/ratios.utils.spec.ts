import { describe, it, expect } from 'vitest';
import { calculateFinancialRatios } from './ratios.utils';

describe('Ratios Utils', () => {
    it('should calculate ratios correctly', () => {
        const result = calculateFinancialRatios({
            currentAssets: 200,
            currentLiabilities: 100,
            inventory: 50,
            totalDebt: 300,
            totalEquity: 300
        });

        // Current Ratio = 200/100 = 2
        expect(result.currentRatio).toBe(2);
        // Quick Ratio = (200 - 50)/100 = 1.5
        expect(result.quickRatio).toBe(1.5);
        // Debt/Equity = 300/300 = 1
        expect(result.debtToEquity).toBe(1);
    });

    it('should handle missing values (defaults)', () => {
        const result = calculateFinancialRatios({});
        expect(result.currentRatio).toBe(0);
    });
});
