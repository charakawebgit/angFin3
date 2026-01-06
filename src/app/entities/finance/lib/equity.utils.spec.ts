import { describe, it, expect } from 'vitest';
import { calculateDdm, calculateCapm, calculateWacc, calculateDupont, calculateBlackScholes } from './equity.utils';

describe('Equity Utils', () => {
    describe('Dividend Discount Model (DDM)', () => {
        it('should calculate DDM value correctly', () => {
            // P = D1 / (r - g)
            // 2 / (0.10 - 0.05) = 2 / 0.05 = 40
            const val = calculateDdm({ dividend: 2, returnRate: 0.10, growthRate: 0.05 });
            expect(val).toBeCloseTo(40, 2);
        });

        it('should handle zero growth', () => {
            const val = calculateDdm({ dividend: 5, returnRate: 0.10, growthRate: 0 });
            expect(val).toBeCloseTo(50, 2);
        });
    });

    describe('Capital Asset Pricing Model (CAPM)', () => {
        it('should calculate expected return correctly', () => {
            // E(Ri) = Rf + B * (Rm - Rf)
            // 0.03 + 1.2 * (0.10 - 0.03)
            // 0.03 + 1.2 * 0.07
            // 0.03 + 0.084 = 0.114 (11.4%)
            const ke = calculateCapm({ riskFreeRate: 0.03, beta: 1.2, marketReturn: 0.10 });
            expect(ke).toBeCloseTo(0.114, 4);
        });
    });

    describe('WACC', () => {
        it('should calculate WACC correctly', () => {
            // E = 600, D = 400, V = 1000
            // Ke = 0.12, Kd = 0.06, Tax = 0.30
            // WACC = (600/1000 * 0.12) + (400/1000 * 0.06 * (1 - 0.30))
            // 0.072 + (0.4 * 0.06 * 0.7)
            // 0.072 + 0.0168 = 0.0888 (8.88%)
            const wacc = calculateWacc({
                equityValue: 600,
                debtValue: 400,
                costOfEquity: 0.12,
                costOfDebt: 0.06,
                taxRate: 0.30
            });
            expect(wacc).toBeCloseTo(0.0888, 4);
        });
    });

    describe('DuPont Analysis', () => {
        it('should breakdown ROE correctly', () => {
            const result = calculateDupont({
                netIncome: 50,
                revenue: 500,
                assets: 1000,
                equity: 400
            });

            // PM = 50 / 500 = 0.10
            expect(result.profitMargin).toBeCloseTo(0.10, 2);
            // AT = 500 / 1000 = 0.50
            expect(result.assetTurnover).toBeCloseTo(0.50, 2);
            // EM = 1000 / 400 = 2.50
            expect(result.equityMultiplier).toBeCloseTo(2.50, 2);
            // ROE = 0.1 * 0.5 * 2.5 = 0.125
            expect(result.roe).toBeCloseTo(0.125, 3);
        });
    });

    describe('Black-Scholes', () => {
        it('should calculate option prices correctly', () => {
            // S=100, K=100, T=1, r=0.05, sigma=0.20
            // Standard example values
            const result = calculateBlackScholes({
                stockPrice: 100,
                strikePrice: 100,
                time: 1,
                riskFreeRate: 0.05,
                volatility: 0.20
            });

            // Expected Call approx 10.45
            expect(result.callPrice).toBeCloseTo(10.45, 1);
            // Put-Call Parity check or approximate Put value
            expect(result.putPrice).toBeGreaterThan(0);
        });
    });
});
