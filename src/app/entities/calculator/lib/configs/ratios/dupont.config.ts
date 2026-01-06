import { CalculatorConfig } from '../../../model/types';
import { calculateDupont } from '@entities/finance/lib/equity.utils';

const CONFIG: CalculatorConfig = {
    id: 'dupont',
    title: 'DuPont Analysis',
    subtitle: 'ROE Decomposition',
    description: 'Break down Return on Equity (ROE) into profit margin, asset turnover, and financial leverage.',
    icon: 'pie-chart',
    category: 'Analysis',
    fields: [
        { key: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$', required: true },
        { key: 'revenue', label: 'Revenue', type: 'number', defaultValue: 200000, prefix: '$', required: true },
        { key: 'assets', label: 'Total Assets', type: 'number', defaultValue: 500000, prefix: '$', required: true },
        { key: 'equity', label: 'Shareholders Equity', type: 'number', defaultValue: 300000, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Profit Margin',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).profitMargin
        },
        {
            label: 'Asset Turnover',
            type: 'number',
            themeColor: 'blue',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).assetTurnover
        },
        {
            label: 'Equity Multiplier',
            type: 'number',
            themeColor: 'amber',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).equityMultiplier
        },
        {
            label: 'ROE',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).roe
        }
    ],
    insights: 'The DuPont formula shows that a company can increase its ROE by having high profit margins, turning over its assets quickly, or using more leverage.',
    formula: 'ROE = Net Profit Margin × Asset Turnover × Equity Multiplier'
};

export default CONFIG;
