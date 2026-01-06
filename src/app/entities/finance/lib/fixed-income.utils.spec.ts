import { describe, it, expect } from 'vitest';
import { calculateBondPrice, calculateYtm, calculateDuration, calculateConvexity } from './fixed-income.utils';

describe('Fixed Income Utils', () => {
    describe('Bond Price', () => {
        it('should calculate bond price correctly', () => {
            // Face=1000, Coupon=0.05, Market=0.06, Years=5, Freq=2
            // Price should be < 1000 (discount)
            const price = calculateBondPrice({
                faceValue: 1000,
                couponRate: 0.05,
                marketRate: 0.06,
                years: 5,
                frequency: 2
            });
            expect(price).toBeCloseTo(957.35, 2);
        });
    });

    describe('YTM', () => {
        it('should estimate YTM correctly', () => {
            // Price=957.35, Face=1000, Coupon=0.05, Years=5, Freq=1
            const ytm = calculateYtm({
                currentPrice: 957.35,
                faceValue: 1000,
                couponRate: 0.05,
                years: 5,
                frequency: 1 // Simplified annual for estimation check
            });
            expect(ytm).toBeCloseTo(0.06, 3);
        });
    });

    describe('Duration', () => {
        it('should calculate Macaulay Duration', () => {
            // Face=1000, Coupon=0.05, Market=0.05 (Par), Years=3, Freq=1
            const dur = calculateDuration({
                faceValue: 1000,
                couponRate: 0.05,
                marketRate: 0.05,
                years: 3,
                frequency: 1
            });
            // Roughly slightly less than 3
            expect(dur.macaulay).toBeCloseTo(2.86, 2);
        });
    });

    describe('Convexity', () => {
        it('should calculate Convexity', () => {
            const conv = calculateConvexity({
                faceValue: 1000,
                couponRate: 0.08,
                marketRate: 0.10,
                years: 10,
                frequency: 1
            });
            expect(conv).toBeGreaterThan(0);
        });
    });
});
