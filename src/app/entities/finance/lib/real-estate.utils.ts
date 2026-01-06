import Decimal from 'decimal.js';
import { AmortizationParams, AmortizationResult, CapRateParams } from '../model/types';

export function calculateAmortization(params: AmortizationParams): AmortizationResult {
    const P = new Decimal(params.loanAmount);
    const rAnnual = new Decimal(params.interestRate);
    const rMonthly = rAnnual.div(12);
    const n = new Decimal(params.loanTerm).times(12);

    let monthlyPayment = new Decimal(0);
    let totalInterest = new Decimal(0);

    if (n.isZero()) {
        return {
            summary: {
                monthlyPayment: 0,
                totalInterest: 0
            }
        };
    }

    if (!rMonthly.isZero()) {
        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const numerator = rMonthly.times(rMonthly.plus(1).pow(n));
        const denominator = rMonthly.plus(1).pow(n).minus(1);
        monthlyPayment = P.times(numerator.div(denominator));
    } else {
        // Simple division if rate is 0
        if (!n.isZero()) {
            monthlyPayment = P.div(n);
        } else {
            monthlyPayment = new Decimal(0);
        }
    }

    const totalPayment = monthlyPayment.times(n);
    totalInterest = totalPayment.minus(P);

    const schedule: AmortizationResult['schedule'] = [];
    let balance = P;

    for (let i = 1; i <= n.toNumber(); i++) {
        const interest = balance.times(rMonthly);
        const principal = monthlyPayment.minus(interest);
        balance = balance.minus(principal);

        // Handle last payment rounding differences
        if (balance.lessThan(0)) balance = new Decimal(0);

        schedule.push({
            period: i,
            interest: interest.toNumber(),
            principal: principal.toNumber(),
            balance: balance.toNumber()
        });
    }

    return {
        summary: {
            monthlyPayment: monthlyPayment.toNumber(),
            totalInterest: totalInterest.toNumber()
        },
        schedule
    };
}

export function calculateCapRate(params: CapRateParams): number {
    const noi = new Decimal(params.noi);
    const val = new Decimal(params.propertyValue);

    if (val.isZero()) return 0;

    return noi.div(val).toNumber();
}
