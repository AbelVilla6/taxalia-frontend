export type FilingStatus =
  | 'marriedJoint'
  | 'qualifiedSurvivingSpouse'
  | 'single'
  | 'headOfHousehold'
  | 'marriedSeparate';

export type DependentStatus = 'no' | 'yes' | 'both';
export type DeductionMethod = 'standard' | 'itemized';

export const TAX_YEAR = 2026;

export const standardDeductions: Record<FilingStatus, number> = {
  marriedJoint: 32_200,
  qualifiedSurvivingSpouse: 33_200,
  single: 16_100,
  headOfHousehold: 24_150,
  marriedSeparate: 16_100,
};

export interface TaxCalculatorInput {
  filingStatus: FilingStatus | string;
  dependentStatus?: DependentStatus | string;

  // Backwards-compatible aliases used by the previous version.
  income?: number;
  grossIncome?: number;
  deductions?: number;
  credits?: number;
  withholding?: number;

  // Filing status & dependents.
  childDependents?: number;
  otherDependents?: number;

  // Wages and income.
  wages?: number;
  spouseWages?: number;
  taxableInterest?: number;
  taxExemptInterest?: number;
  ordinaryDividends?: number;
  qualifiedDividends?: number;
  shortTermCapitalGains?: number;
  longTermCapitalGains?: number;
  businessIncome?: number;
  retirementIncome?: number;
  socialSecurityBenefits?: number;
  unemploymentIncome?: number;
  otherIncome?: number;

  // Adjustments.
  traditionalIraDeduction?: number;
  studentLoanInterest?: number;
  otherAdjustments?: number;

  // Standard or itemized deduction.
  taxpayerOver65?: boolean;
  taxpayerBlind?: boolean;
  spouseOver65?: boolean;
  spouseBlind?: boolean;
  medicalExpenses?: number;
  stateLocalTaxes?: number;
  mortgageInterest?: number;
  charitableGifts?: number;
  otherItemizedDeductions?: number;

  // Payments and credits.
  federalWithholding?: number;
  estimatedTaxPayments?: number;
  additionalNonrefundableCredits?: number;
  refundableCredits?: number;
}

export interface TaxCalculatorResult {
  taxYear: number;
  totalIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  standardDeduction: number;
  itemizedDeductions: number;
  deductionsUsed: number;
  deductionMethod: DeductionMethod;
  totalAdjustments: number;
  taxableSocialSecurity: number;
  ordinaryTaxableIncome: number;
  preferentialIncome: number;
  estimatedTaxBeforeCredits: number;
  taxBeforeCredits: number;
  childTaxCredit: number;
  otherDependentCredit: number;
  dependentCreditPhaseout: number;
  totalNonrefundableCredits: number;
  estimatedTaxAfterCredits: number;
  estimatedTax: number;
  totalPayments: number;
  effectiveTaxRate: number;
  effectiveRate: number;
  marginalRate: number;
  refundOrOwed: number;
  refund: number;
  amountOwed: number;
  monthlySetAside: number;
  suggestedDeduction: number;
}

type Bracket = { limit: number; rate: number };

const ORDINARY_BRACKETS: Record<FilingStatus, Bracket[]> = {
  marriedJoint: [
    { limit: 24_800, rate: 0.1 },
    { limit: 100_800, rate: 0.12 },
    { limit: 211_400, rate: 0.22 },
    { limit: 403_550, rate: 0.24 },
    { limit: 512_450, rate: 0.32 },
    { limit: 768_700, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  qualifiedSurvivingSpouse: [
    { limit: 24_800, rate: 0.1 },
    { limit: 100_800, rate: 0.12 },
    { limit: 211_400, rate: 0.22 },
    { limit: 403_550, rate: 0.24 },
    { limit: 512_450, rate: 0.32 },
    { limit: 768_700, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  single: [
    { limit: 12_400, rate: 0.1 },
    { limit: 50_400, rate: 0.12 },
    { limit: 105_700, rate: 0.22 },
    { limit: 201_775, rate: 0.24 },
    { limit: 256_225, rate: 0.32 },
    { limit: 640_600, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  headOfHousehold: [
    { limit: 17_700, rate: 0.1 },
    { limit: 67_450, rate: 0.12 },
    { limit: 105_700, rate: 0.22 },
    { limit: 201_750, rate: 0.24 },
    { limit: 256_200, rate: 0.32 },
    { limit: 640_600, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  marriedSeparate: [
    { limit: 12_400, rate: 0.1 },
    { limit: 50_400, rate: 0.12 },
    { limit: 105_700, rate: 0.22 },
    { limit: 201_775, rate: 0.24 },
    { limit: 256_225, rate: 0.32 },
    { limit: 384_350, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
};

const CAPITAL_GAIN_BRACKETS: Record<FilingStatus, Bracket[]> = {
  marriedJoint: [
    { limit: 98_900, rate: 0 },
    { limit: 613_700, rate: 0.15 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
  qualifiedSurvivingSpouse: [
    { limit: 98_900, rate: 0 },
    { limit: 613_700, rate: 0.15 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
  single: [
    { limit: 49_450, rate: 0 },
    { limit: 545_500, rate: 0.15 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
  headOfHousehold: [
    { limit: 66_200, rate: 0 },
    { limit: 579_600, rate: 0.15 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
  marriedSeparate: [
    { limit: 49_450, rate: 0 },
    { limit: 306_850, rate: 0.15 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
};

const SOCIAL_SECURITY_LIMITS: Record<FilingStatus, { base: number; phaseout: number }> = {
  marriedJoint: { base: 32_000, phaseout: 12_000 },
  qualifiedSurvivingSpouse: { base: 25_000, phaseout: 9_000 },
  single: { base: 25_000, phaseout: 9_000 },
  headOfHousehold: { base: 25_000, phaseout: 9_000 },
  marriedSeparate: { base: 0, phaseout: 0 },
};

function normalizeStatus(status: FilingStatus | string): FilingStatus {
  if (
    status === 'marriedJoint' ||
    status === 'qualifiedSurvivingSpouse' ||
    status === 'single' ||
    status === 'headOfHousehold' ||
    status === 'marriedSeparate'
  ) {
    return status;
  }

  return 'single';
}

function money(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
}

function count(value: unknown): number {
  return Math.max(0, Math.floor(money(value)));
}

export function suggestedDeductionFor(status: FilingStatus | string): number {
  return standardDeductions[normalizeStatus(status)];
}

export function calculateTaxBeforeCredits(taxableIncome: number, status: FilingStatus | string): number {
  return calculateProgressiveTax(Math.max(0, taxableIncome), ORDINARY_BRACKETS[normalizeStatus(status)]);
}

function calculateProgressiveTax(amount: number, brackets: Bracket[], startingIncome = 0): number {
  if (amount <= 0) return 0;

  let remaining = amount;
  let lowerLimit = 0;
  let total = 0;

  for (const bracket of brackets) {
    const taxableStart = Math.max(lowerLimit, startingIncome);
    const availableWidth = bracket.limit - taxableStart;
    const amountInBracket = Math.min(remaining, Math.max(0, availableWidth));

    if (amountInBracket > 0) {
      total += amountInBracket * bracket.rate;
      remaining -= amountInBracket;
    }

    if (remaining <= 0) break;
    lowerLimit = bracket.limit;
  }

  return total;
}

function calculateCapitalGainTax(preferentialIncome: number, ordinaryTaxableIncome: number, status: FilingStatus): number {
  return calculateProgressiveTax(preferentialIncome, CAPITAL_GAIN_BRACKETS[status], ordinaryTaxableIncome);
}

function getMarginalRate(taxableIncome: number, status: FilingStatus): number {
  const bracket = ORDINARY_BRACKETS[status].find((item) => taxableIncome <= item.limit);
  return bracket?.rate ?? 0;
}

function calculateTaxableSocialSecurity(
  benefits: number,
  status: FilingStatus,
  nonSocialSecurityIncome: number,
  taxExemptInterest: number,
): number {
  if (benefits <= 0) return 0;
  if (status === 'marriedSeparate') return benefits * 0.85;

  const { base, phaseout } = SOCIAL_SECURITY_LIMITS[status];
  const provisionalIncome = nonSocialSecurityIncome + taxExemptInterest + benefits * 0.5;
  const secondThreshold = base + phaseout;

  if (provisionalIncome <= base) return 0;

  if (provisionalIncome <= secondThreshold) {
    return Math.min(benefits * 0.5, (provisionalIncome - base) * 0.5);
  }

  const taxableAt50 = Math.min(benefits * 0.5, phaseout * 0.5);
  const taxableAt85 = (provisionalIncome - secondThreshold) * 0.85;
  return Math.min(benefits * 0.85, taxableAt50 + taxableAt85);
}

function calculateStudentLoanDeduction(amountPaid: number, agiBeforeDeduction: number, status: FilingStatus): number {
  const capped = Math.min(2_500, amountPaid);
  if (capped <= 0 || status === 'marriedSeparate') return 0;

  const phaseoutStart = status === 'marriedJoint' || status === 'qualifiedSurvivingSpouse' ? 175_000 : 85_000;
  const phaseoutEnd = status === 'marriedJoint' || status === 'qualifiedSurvivingSpouse' ? 205_000 : 100_000;

  if (agiBeforeDeduction <= phaseoutStart) return capped;
  if (agiBeforeDeduction >= phaseoutEnd) return 0;

  const percentageRemaining = (phaseoutEnd - agiBeforeDeduction) / (phaseoutEnd - phaseoutStart);
  return capped * percentageRemaining;
}

function calculateStandardDeduction(input: TaxCalculatorInput, status: FilingStatus): number {
  let deduction = standardDeductions[status];
  const dependentStatus = input.dependentStatus === 'yes' || input.dependentStatus === 'both' ? input.dependentStatus : 'no';

  if (dependentStatus !== 'no') {
    const earnedIncome = money(input.wages) + money(input.spouseWages) || money(input.income ?? input.grossIncome);
    deduction = Math.min(deduction, Math.max(1_350, earnedIncome + 450));
  }

  const additionalAmount = status === 'single' || status === 'headOfHousehold' ? 2_050 : 1_650;
  const spouseAllowed = status === 'marriedJoint' || status === 'qualifiedSurvivingSpouse';

  if (input.taxpayerOver65) deduction += additionalAmount;
  if (input.taxpayerBlind) deduction += additionalAmount;
  if (spouseAllowed && input.spouseOver65) deduction += 1_650;
  if (spouseAllowed && input.spouseBlind) deduction += 1_650;

  return deduction;
}

function calculateItemizedDeductions(input: TaxCalculatorInput, status: FilingStatus, agi: number): number {
  const medicalDeduction = Math.max(0, money(input.medicalExpenses) - agi * 0.075);
  const saltCap = status === 'marriedSeparate' ? 20_200 : 40_400;
  const saltDeduction = Math.min(money(input.stateLocalTaxes), saltCap);

  return (
    medicalDeduction +
    saltDeduction +
    money(input.mortgageInterest) +
    money(input.charitableGifts) +
    money(input.otherItemizedDeductions)
  );
}

function calculateDependentCredits(input: TaxCalculatorInput, status: FilingStatus, agi: number) {
  const childCreditBeforePhaseout = count(input.childDependents) * 2_200;
  const otherDependentCreditBeforePhaseout = count(input.otherDependents) * 500;
  const totalBeforePhaseout = childCreditBeforePhaseout + otherDependentCreditBeforePhaseout;
  const threshold = status === 'marriedJoint' ? 400_000 : 200_000;
  const phaseout = agi > threshold ? Math.min(totalBeforePhaseout, Math.ceil((agi - threshold) / 1_000) * 50) : 0;
  const phaseoutRatio = totalBeforePhaseout > 0 ? Math.max(0, (totalBeforePhaseout - phaseout) / totalBeforePhaseout) : 0;

  return {
    childTaxCredit: childCreditBeforePhaseout * phaseoutRatio,
    otherDependentCredit: otherDependentCreditBeforePhaseout * phaseoutRatio,
    dependentCreditPhaseout: phaseout,
  };
}

export function calculateTaxEstimate(input: TaxCalculatorInput): TaxCalculatorResult {
  const status = normalizeStatus(input.filingStatus);
  const legacyIncome = money(input.income ?? input.grossIncome);
  const wages = money(input.wages) + money(input.spouseWages);
  const taxableInterest = money(input.taxableInterest);
  const taxExemptInterest = money(input.taxExemptInterest);
  const ordinaryDividends = money(input.ordinaryDividends);
  const qualifiedDividends = Math.min(money(input.qualifiedDividends), ordinaryDividends);
  const shortTermCapitalGains = money(input.shortTermCapitalGains);
  const longTermCapitalGains = money(input.longTermCapitalGains);
  const businessIncome = money(input.businessIncome);
  const retirementIncome = money(input.retirementIncome);
  const socialSecurityBenefits = money(input.socialSecurityBenefits);
  const unemploymentIncome = money(input.unemploymentIncome);
  const otherIncome = money(input.otherIncome);

  const detailedIncome =
    wages +
    taxableInterest +
    ordinaryDividends +
    shortTermCapitalGains +
    longTermCapitalGains +
    businessIncome +
    retirementIncome +
    unemploymentIncome +
    otherIncome;
  const nonSocialSecurityIncome = detailedIncome || legacyIncome;
  const taxableSocialSecurity = calculateTaxableSocialSecurity(
    socialSecurityBenefits,
    status,
    nonSocialSecurityIncome,
    taxExemptInterest,
  );
  const totalIncome = nonSocialSecurityIncome + taxableSocialSecurity;

  const traditionalIraDeduction = money(input.traditionalIraDeduction);
  const otherAdjustments = money(input.otherAdjustments);
  const agiBeforeStudentLoan = Math.max(0, totalIncome - traditionalIraDeduction - otherAdjustments);
  const studentLoanDeduction = calculateStudentLoanDeduction(money(input.studentLoanInterest), agiBeforeStudentLoan, status);
  const totalAdjustments = traditionalIraDeduction + otherAdjustments + studentLoanDeduction;
  const adjustedGrossIncome = Math.max(0, totalIncome - totalAdjustments);

  const standardDeduction = calculateStandardDeduction(input, status);
  const calculatedItemizedDeductions = calculateItemizedDeductions(input, status, adjustedGrossIncome);
  const legacyDeductions = money(input.deductions);
  const itemizedDeductions = Math.max(calculatedItemizedDeductions, legacyDeductions > 0 ? legacyDeductions : 0);
  const deductionMethod: DeductionMethod = itemizedDeductions > standardDeduction ? 'itemized' : 'standard';
  const deductionsUsed = deductionMethod === 'itemized' ? itemizedDeductions : standardDeduction;
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionsUsed);

  const preferentialIncome = Math.min(taxableIncome, qualifiedDividends + longTermCapitalGains);
  const ordinaryTaxableIncome = Math.max(0, taxableIncome - preferentialIncome);
  const ordinaryTax = calculateTaxBeforeCredits(ordinaryTaxableIncome, status);
  const preferentialTax = calculateCapitalGainTax(preferentialIncome, ordinaryTaxableIncome, status);
  const estimatedTaxBeforeCredits = ordinaryTax + preferentialTax;

  const creditsFromDependents = calculateDependentCredits(input, status, adjustedGrossIncome);
  const additionalCredits = money(input.additionalNonrefundableCredits ?? input.credits);
  const totalNonrefundableCredits = Math.min(
    estimatedTaxBeforeCredits,
    creditsFromDependents.childTaxCredit + creditsFromDependents.otherDependentCredit + additionalCredits,
  );
  const estimatedTaxAfterCredits = Math.max(0, estimatedTaxBeforeCredits - totalNonrefundableCredits);

  const totalPayments =
    money(input.federalWithholding ?? input.withholding) + money(input.estimatedTaxPayments) + money(input.refundableCredits);
  const netBalance = totalPayments - estimatedTaxAfterCredits;
  const refund = Math.max(0, netBalance);
  const amountOwed = Math.max(0, -netBalance);
  const effectiveTaxRate = totalIncome > 0 ? estimatedTaxAfterCredits / totalIncome : 0;

  return {
    taxYear: TAX_YEAR,
    totalIncome,
    adjustedGrossIncome,
    taxableIncome,
    standardDeduction,
    itemizedDeductions,
    deductionsUsed,
    deductionMethod,
    totalAdjustments,
    taxableSocialSecurity,
    ordinaryTaxableIncome,
    preferentialIncome,
    estimatedTaxBeforeCredits,
    taxBeforeCredits: estimatedTaxBeforeCredits,
    childTaxCredit: creditsFromDependents.childTaxCredit,
    otherDependentCredit: creditsFromDependents.otherDependentCredit,
    dependentCreditPhaseout: creditsFromDependents.dependentCreditPhaseout,
    totalNonrefundableCredits,
    estimatedTaxAfterCredits,
    estimatedTax: estimatedTaxAfterCredits,
    totalPayments,
    effectiveTaxRate,
    effectiveRate: effectiveTaxRate * 100,
    marginalRate: getMarginalRate(taxableIncome, status),
    refundOrOwed: netBalance,
    refund,
    amountOwed,
    monthlySetAside: estimatedTaxAfterCredits / 12,
    suggestedDeduction: standardDeduction,
  };
}

export function formatUSD(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, locale = 'en-US'): string {
  return (
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value : 0) + '%'
  );
}
