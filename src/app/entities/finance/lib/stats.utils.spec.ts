import { describe, it, expect } from 'vitest';
import { calculateStandardDeviation, calculateSampleVariance, calculateMeanAbsoluteDeviation, calculateGeometricMean } from './stats.utils';

describe('Stats Utils', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];

    it('should calculate SD correctly', () => {
        // Variance = 32/7 = 4.57
        // SD = sqrt(4.57) = 2.14
        const sd = calculateStandardDeviation({ values: data });
        expect(sd).toBeCloseTo(2.1381, 3);
    });

    it('should calculate Variance correctly', () => {
        const v = calculateSampleVariance({ values: data });
        // Sum sq diffs = 32. n-1 = 7. 32/7 = 4.5714...
        expect(v).toBeCloseTo(4.5714, 3);
    });

    it('should calculate MAD correctly', () => {
        // Mean = 5
        // Abs Devs: 3, 1, 1, 1, 0, 0, 2, 4 -> Sum = 12
        // MAD = 12 / 8 = 1.5
        const mad = calculateMeanAbsoluteDeviation({ values: data });
        expect(mad).toBeCloseTo(1.5, 4);
    });

    it('should calculate Geometric Mean', () => {
        // 10%, 50%, -10% => 1.1, 1.5, 0.9
        // GeoMean = (1.1 * 1.5 * 0.9)^(1/3) - 1
        // 1.485^(1/3) - 1 ~= 1.1409 - 1 = 0.1409
        const gm = calculateGeometricMean({ returns: [0.10, 0.50, -0.10] });
        expect(gm).toBeCloseTo(0.1409, 3);
    });
});
