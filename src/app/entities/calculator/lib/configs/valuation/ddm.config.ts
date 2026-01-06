import { CalculatorConfig } from '../../../model/types';
import { calculateDdm } from '@entities/finance/lib/equity.utils';

const CONFIG: CalculatorConfig = {
    id: 'ddm',
    title: 'Dividend Discount Model',
    subtitle: 'Intrinsic stock value',
    description: 'Estimate the value of a stock based on the present value of its expected future dividends.',
    icon: 'trending-up',
    category: 'Valuation',
    fields: [
        { key: 'dividend', label: 'Next Year Dividend (D1)', type: 'number', defaultValue: 2.50, prefix: '$', required: true },
        { key: 'returnRate', label: 'Required Return (%)', type: 'number', defaultValue: 8, suffix: '%', required: true },
        { key: 'growthRate', label: 'Dividend Growth Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Fair Stock Value',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => calculateDdm({
                dividend: d['dividend'] as number,
                returnRate: (d['returnRate'] as number) / 100,
                growthRate: (d['growthRate'] as number) / 100
            })
        }
    ],
    insights: 'The DDM assumes that the value of a stock is the sum of all its future dividend payments, discounted back to their present value.',
    formula: 'P0 = D1 / (k - g)'
};

export default CONFIG;
