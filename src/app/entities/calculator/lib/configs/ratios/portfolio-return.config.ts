import { CalculatorConfig } from '../../../model/types';
import { calculatePortfolioReturn } from '@entities/finance/lib/investment.utils';

// Wait, calculatePortfolioReturn is NOT in investment.utils.ts in angFin3 yet.
// I need to add it!
// Step 1285 `investment.utils.ts` had FutureValue... EffectiveAnnualRate.
// Step 1363 I am adding HoldingPeriodReturn, BankDiscountYield, EffectiveAnnualYield, Roi.
// I am NOT adding `calculatePortfolioReturn`, `calculateSharpeRatio`, `calculateTwoAssetPortfolioStdDev` in call 1363 (just check the code snippet).
// Oh, the replacement content in 1363 ENDS with `calculateRoi`.
// I MISSED `calculatePortfolioReturn`, `calculateSharpeRatio`, `calculateTwoAssetPortfolioStdDev` despite seeing them in reading step 1358!
// I need another `replace` or append to add them.
// I will add them in `investment.utils.ts` in a moment.
// But first I will write this config assuming I'll fix the util next.

const CONFIG: CalculatorConfig = {
    id: 'portfolio-return',
    title: 'Portfolio Return',
    subtitle: 'Weighted average return',
    description: 'Calculate the overall return of a portfolio based on the weights and returns of individual assets.',
    icon: 'briefcase',
    category: 'Portfolio',
    fields: [
        { key: 'weights', label: 'Asset Weights (%)', type: 'list', defaultValue: [40, 60], required: true },
        { key: 'returns', label: 'Asset Returns (%)', type: 'list', defaultValue: [8, 12], required: true },
    ],
    results: [
        {
            label: 'Total Portfolio Return',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => {
                const weights = (d['weights'] as number[] || []).map(v => Number(v) / 100);
                const returns = (d['returns'] as number[] || []).map(v => Number(v) / 100);
                return calculatePortfolioReturn({ weights, returns });
            }
        }
    ],
    insights: 'The return of a portfolio is simply the weighted average of the returns of the securities in that portfolio.',
    formula: 'Rp = ∑ (wi * ri)'
};

export default CONFIG;
