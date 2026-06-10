export type FilingStatus = 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';

export const standardDeductions: Record<FilingStatus, number> = {
  single: 15_700,
  marriedJoint: 31_400,
  marriedSeparate: 15_700,
  headOfHousehold: 23_625,
};

export interface TaxCalculatorInput {
  filingStatus: FilingStatus;
  income?: number;
  grossIncome?: number;
  deductions: number;
  credits: number;
  withholding: number;
}

export interface TaxCalculatorResult {
  taxableIncome: number;
  estimatedTax: number;
  estimatedTaxBeforeCredits: number;
  estimatedTaxAfterCredits: number;
  effectiveTaxRate: number;
  effectiveRate: number;
  refundOrOwed: number;
  refund: number;
  amountOwed: number;
  monthlySetAside: number;
  suggestedDeduction: number;
}

const BRACKETS: Record<FilingStatus, Array<{ limit: number; rate: number }>> = {
  single: [
    { limit: 11_925, rate: 0.1 },
    { limit: 48_475, rate: 0.12 },
    { limit: 103_350, rate: 0.22 },
    { limit: 197_300, rate: 0.24 },
    { limit: 250_525, rate: 0.32 },
    { limit: 626_350, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  marriedJoint: [
    { limit: 23_850, rate: 0.1 },
    { limit: 96_950, rate: 0.12 },
    { limit: 206_700, rate: 0.22 },
    { limit: 394_600, rate: 0.24 },
    { limit: 501_050, rate: 0.32 },
    { limit: 751_600, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  marriedSeparate: [
    { limit: 11_925, rate: 0.1 },
    { limit: 48_475, rate: 0.12 },
    { limit: 103_350, rate: 0.22 },
    { limit: 197_300, rate: 0.24 },
    { limit: 250_525, rate: 0.32 },
    { limit: 375_800, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  headOfHousehold: [
    { limit: 17_000, rate: 0.1 },
    { limit: 64_850, rate: 0.12 },
    { limit: 103_350, rate: 0.22 },
    { limit: 197_300, rate: 0.24 },
    { limit: 250_500, rate: 0.32 },
    { limit: 626_350, rate: 0.35 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
};

export function suggestedDeductionFor(status: FilingStatus): number {
  return standardDeductions[status];
}

export function calculateTaxBeforeCredits(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;

  let remaining = taxableIncome;
  let lowerLimit = 0;
  let total = 0;

  for (const bracket of BRACKETS[status]) {
    const bracketWidth = bracket.limit - lowerLimit;
    const amountInBracket = Math.min(remaining, bracketWidth);
    if (amountInBracket > 0) {
      total += amountInBracket * bracket.rate;
      remaining -= amountInBracket;
    }
    if (remaining <= 0) break;
    lowerLimit = bracket.limit;
  }

  return total;
}

export function calculateTaxEstimate(input: TaxCalculatorInput): TaxCalculatorResult {
  const grossIncome = Math.max(0, input.income ?? input.grossIncome ?? 0);
  const deductions = Math.max(0, input.deductions);
  const credits = Math.max(0, input.credits);
  const withholding = Math.max(0, input.withholding);
  const taxableIncome = Math.max(0, grossIncome - deductions);
  const estimatedTaxBeforeCredits = calculateTaxBeforeCredits(taxableIncome, input.filingStatus);
  const estimatedTaxAfterCredits = Math.max(0, estimatedTaxBeforeCredits - credits);
  const netBalance = withholding - estimatedTaxAfterCredits;
  const refund = Math.max(0, netBalance);
  const amountOwed = Math.max(0, -netBalance);
  const effectiveTaxRate = grossIncome > 0 ? estimatedTaxAfterCredits / grossIncome : 0;

  return {
    taxableIncome,
    estimatedTax: estimatedTaxAfterCredits,
    estimatedTaxBeforeCredits,
    estimatedTaxAfterCredits,
    effectiveTaxRate,
    effectiveRate: effectiveTaxRate * 100,
    refundOrOwed: netBalance,
    refund,
    amountOwed,
    monthlySetAside: estimatedTaxAfterCredits / 12,
    suggestedDeduction: suggestedDeductionFor(input.filingStatus),
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
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0) + '%';
}
