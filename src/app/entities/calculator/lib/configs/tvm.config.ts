import { CalculatorConfig } from '../../model/types';
import { solveTvm } from '@entities/finance/lib/tvm';
import { TvmParams, TvmSolveTarget } from '@entities/finance/model/types';

const TVM_CONFIG: CalculatorConfig = {
    id: 'tvm',
    title: 'Time Value of Money',
    subtitle: 'Calculate Present Value, Future Value, Payments, and Interest Rates',
    description: 'The Time Value of Money (TVM) is the core principle of finance that money available at the present time is worth more than the identical sum in the future due to its potential earning capacity.',
    icon: 'coins',
    category: 'Corporate Finance',
    fields: [
        {
            key: 'solveFor',
            label: 'Solve For',
            type: 'select',
            defaultValue: 'FV',
            options: [
                { label: 'Future Value (FV)', value: 'FV' },
                { label: 'Present Value (PV)', value: 'PV' },
                { label: 'Payment (PMT)', value: 'PMT' },
                { label: 'Number of Periods (N)', value: 'N' },
                { label: 'Interest Rate (I/Y)', value: 'IY' }
            ],
            group: 'Configuration'
        },
        {
            key: 'n',
            label: 'Number of Periods (N)',
            type: 'number',
            defaultValue: 10,
            min: 0,
            group: 'Variables'
        },
        {
            key: 'iy',
            label: 'Interest Rate (I/Y)',
            type: 'number',
            defaultValue: 5,
            suffix: '%',
            group: 'Variables'
        },
        {
            key: 'pv',
            label: 'Present Value (PV)',
            type: 'number',
            defaultValue: 0,
            prefix: '$',
            group: 'Variables'
        },
        {
            key: 'pmt',
            label: 'Payment (PMT)',
            type: 'number',
            defaultValue: 0,
            prefix: '$',
            group: 'Variables'
        },
        {
            key: 'fv',
            label: 'Future Value (FV)',
            type: 'number',
            defaultValue: 0,
            prefix: '$',
            group: 'Variables'
        },
        {
            key: 'cpy',
            label: 'Compounding Frequency',
            type: 'number',
            defaultValue: 1,
            group: 'Settings'
        }
    ],
    results: [
        {
            label: 'Result',
            type: 'currency',
            calculate: (data) => {
                const solveFor = data['solveFor'] as TvmSolveTarget;
                // TVM logic requires careful handling of undefined for the variable being solved
                const params: TvmParams = {
                    solveFor: solveFor,
                    cpy: Number(data['cpy'] || 1),
                    n: solveFor === 'N' ? undefined : Number(data['n']),
                    iy: solveFor === 'IY' ? undefined : Number(data['iy']),
                    pv: solveFor === 'PV' ? undefined : Number(data['pv']),
                    pmt: solveFor === 'PMT' ? undefined : Number(data['pmt']),
                    fv: solveFor === 'FV' ? undefined : Number(data['fv']),
                };
                return solveTvm(params);
            }
        }
    ]
};

export default TVM_CONFIG;
