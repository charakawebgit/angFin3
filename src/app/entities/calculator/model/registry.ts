import { CalculatorConfig } from './types';

// TVM
import TVM_CONFIG from '../lib/configs/tvm.config';

// Real Estate
import AMORTIZATION_CONFIG from '../lib/configs/real-estate/amortization.config';
import CAP_RATE_CONFIG from '../lib/configs/real-estate/cap-rate.config';

// Valuation
import BLACK_SCHOLES_CONFIG from '../lib/configs/valuation/black-scholes.config';
import BOND_VALUATION_CONFIG from '../lib/configs/valuation/bond-valuation.config';
import CAPM_CONFIG from '../lib/configs/valuation/capm.config';
import DDM_CONFIG from '../lib/configs/valuation/ddm.config';
import HPR_CONFIG from '../lib/configs/valuation/hpr.config';

// Fixed Income
import CONVEXITY_CONFIG from '../lib/configs/fixed-income/convexity.config';
import DURATION_CONFIG from '../lib/configs/fixed-income/duration.config';
import EAR_CONFIG from '../lib/configs/fixed-income/ear.config';
import RBD_EAY_CONFIG from '../lib/configs/fixed-income/rbd-eay.config';
import YTM_CONFIG from '../lib/configs/fixed-income/ytm.config';

// Corporate Finance
import IRR_CONFIG from '../lib/configs/corp-finance/irr.config';
import NPV_CONFIG from '../lib/configs/corp-finance/npv.config';
import WACC_CONFIG from '../lib/configs/corp-finance/wacc.config';

// Ratios & Statistics
import CV_CONFIG from '../lib/configs/ratios/cv.config';
import DUPONT_CONFIG from '../lib/configs/ratios/dupont.config';
import FINANCIAL_RATIOS_CONFIG from '../lib/configs/ratios/financial-ratios.config';
import GEOMETRIC_MEAN_CONFIG from '../lib/configs/ratios/geometric-mean.config';
import MAD_CONFIG from '../lib/configs/ratios/mad.config';
import PORTFOLIO_RETURN_CONFIG from '../lib/configs/ratios/portfolio-return.config';
import PORTFOLIO_RISK_CONFIG from '../lib/configs/ratios/portfolio-risk.config';
import ROI_CONFIG from '../lib/configs/ratios/roi.config';
import SHARPE_RATIO_CONFIG from '../lib/configs/ratios/sharpe-ratio.config';
import SKEW_KURT_CONFIG from '../lib/configs/ratios/skew-kurt.config';
import VARIANCE_STDDEV_CONFIG from '../lib/configs/ratios/variance-stddev.config';

/**
 * Central registry of all calculator configurations.
 * Organized by financial category for easy maintenance.
 * 
 * @remarks
 * Each calculator config includes:
 * - Metadata (id, title, description, icon, category)
 * - Field definitions for user inputs
 * - Result calculations and formatting
 * 
 * @example
 * ```ts
 * const tvmCalc = CALCULATOR_REGISTRY.find(c => c.id === 'tvm');
 * ```
 */
export const CALCULATOR_REGISTRY: readonly CalculatorConfig[] = [
    TVM_CONFIG,

    // Real Estate
    AMORTIZATION_CONFIG,
    CAP_RATE_CONFIG,

    // Valuation
    BLACK_SCHOLES_CONFIG,
    BOND_VALUATION_CONFIG,
    CAPM_CONFIG,
    DDM_CONFIG,
    HPR_CONFIG,

    // Fixed Income
    CONVEXITY_CONFIG,
    DURATION_CONFIG,
    EAR_CONFIG,
    RBD_EAY_CONFIG,
    YTM_CONFIG,

    // Corporate Finance
    IRR_CONFIG,
    NPV_CONFIG,
    WACC_CONFIG,

    // Ratios & Statistics
    CV_CONFIG,
    DUPONT_CONFIG,
    FINANCIAL_RATIOS_CONFIG,
    GEOMETRIC_MEAN_CONFIG,
    MAD_CONFIG,
    PORTFOLIO_RETURN_CONFIG,
    PORTFOLIO_RISK_CONFIG,
    ROI_CONFIG,
    SHARPE_RATIO_CONFIG,
    SKEW_KURT_CONFIG,
    VARIANCE_STDDEV_CONFIG
];
