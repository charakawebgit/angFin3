export type TvmSolveTarget = 'FV' | 'PV' | 'PMT' | 'N' | 'IY';

export interface TvmParams {
    solveFor: TvmSolveTarget;
    n?: number;
    iy?: number;
    pv?: number;
    pmt?: number;
    fv?: number;
    cpy: number; // Compounding periods per year
}

export interface DdmParams {
    dividend: number;
    returnRate: number;
    growthRate: number;
}

export interface CapmParams {
    riskFreeRate: number;
    beta: number;
    marketReturn: number;
}

export interface WaccParams {
    equityValue: number;
    debtValue: number;
    costOfEquity: number;
    costOfDebt: number;
    taxRate: number;
}

export interface DupontParams {
    netIncome: number;
    revenue: number;
    assets: number;
    equity: number;
}

export interface DupontResult {
    profitMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
    roe: number;
}

export interface BlackScholesParams {
    stockPrice: number;
    strikePrice: number;
    time: number;
    riskFreeRate: number;
    volatility: number;
}

export interface BlackScholesResult {
    callPrice: number;
    putPrice: number;
}

export interface BondParams {
    faceValue: number;
    couponRate: number;
    marketRate: number;
    years: number;
    frequency: number;
}

export interface YtmParams {
    currentPrice: number;
    faceValue: number;
    couponRate: number;
    years: number;
    frequency: number;
}

export interface AmortizationParams {
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
}

export interface AmortizationResult {
    summary: {
        monthlyPayment: number;
        totalInterest: number;
    };
    schedule?: {
        period: number;
        interest: number;
        principal: number;
        balance: number;
    }[];
}

export interface CapRateParams {
    noi: number;
    propertyValue: number;
}

export interface FinancialRatiosParams {
    currentAssets?: number;
    currentLiabilities?: number;
    inventory?: number;
    totalDebt?: number;
    totalEquity?: number;
}

export interface FinancialRatiosResult {
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
}

export interface FutureValueParams {
    pv: number;
    rate: number;
    periods: number;
}

export interface PresentValueParams {
    fv: number;
    rate: number;
    periods: number;
}

export interface NpvParams {
    initialInvestment: number;
    cashFlows: number[];
    discountRate: number;
}

export interface IrrParams {
    cashFlows: number[];
}

export interface PerpetuityParams {
    pmt: number;
    rate: number;
}

export interface EffectiveAnnualRateParams {
    nominalRate: number;
    compoundingPeriods: number;
}

export interface HoldingPeriodReturnParams {
    beginningValue: number;
    endingValue: number;
}

export interface BankDiscountYieldParams {
    faceValue: number;
    purchasePrice: number;
    days: number;
}

export interface EffectiveAnnualYieldParams {
    hpy: number;
    days: number;
}

export interface RoiParams {
    amountGained: number;
    amountSpent: number;
}

export interface PortfolioReturnParams {
    weights: number[];
    returns: number[];
}

export interface SharpeRatioParams {
    portfolioReturn: number;
    riskFreeRate: number;
    stdDev: number;
}

export interface TwoAssetPortfolioParams {
    w1: number;
    s1: number;
    w2: number;
    s2: number;
    corr: number;
}

export interface StandardDeviationParams {
    values: number[];
}

export interface SampleVarianceParams {
    values: number[];
}

export interface MeanAbsoluteDeviationParams {
    values: number[];
}

export interface CoefficientVariationParams {
    values: number[];
}

export interface GeometricMeanParams {
    returns: number[];
}

export interface SampleSkewnessParams {
    values: number[];
}

export interface ExcessKurtosisParams {
    values: number[];
}
