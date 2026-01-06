import { CalculatorConfig } from '../../../model/types';
// import { calculateHoldingPeriodReturn } from '@entities/finance/lib/investment.utils'; // Unused

// Note: calculateHoldingPeriodReturn was implicitly in investment.utils in source but I need to verify if I ported it? 
// Wait, I ported calculateEffectiveAnnualRate etc. DID I port calculateHoldingPeriodReturn?
// I need to check investment.utils.ts content I wrote in step 1285.
// Step 1285 content: FutureValue, PresentValue, Npv, Irr, Perpetuity, EffectiveAnnualRate.
// MISSING: calculateHoldingPeriodReturn. Be careful!

const CONFIG: CalculatorConfig = {
    id: 'hpr',
    title: 'Holding Period Return',
    subtitle: 'Total return over a period',
    description: 'Calculate the total return on an investment for the entire period it was held.',
    icon: 'calendar-days',
    category: 'Returns',
    fields: [
        { key: 'beginningValue', label: 'Beginning Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'endingValue', label: 'Ending Value', type: 'number', defaultValue: 1100, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Holding Period Return (HPR)',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => {
                // Inline implementation if function is missing or I need to add it to utils
                return (Number(d['endingValue']) - Number(d['beginningValue'])) / Number(d['beginningValue']);
            }
        }
    ],
    insights: 'HPR is the simplest measure of investment performance, representing the total percentage growth/decline over a specific holding period.',
    formula: 'HPR = (Ending Value - Beginning Value) / Beginning Value'
};

export default CONFIG;
