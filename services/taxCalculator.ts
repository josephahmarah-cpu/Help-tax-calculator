
import { TaxInputs, TaxCalculationResult, TaxBandResult } from '../types';
import { TAX_BANDS } from '../constants';

export const calculateTax = (inputs: TaxInputs): TaxCalculationResult => {
  const annualGross = (inputs.monthlyGrossIncome + inputs.otherIncome) * 12;

  // 1. Calculate Consolidated Relief Allowance (CRA)
  const baseCRA = Math.max(200000, 0.01 * annualGross);
  const percentCRA = 0.20 * annualGross;
  const totalCRA = baseCRA + percentCRA;

  // 2. Sum Deductions
  const totalAllowableDeductions = 
    (inputs.pensionContribution + inputs.nhfContribution + inputs.otherDeductions) * 12;

  // 3. Taxable Income
  let taxableIncome = annualGross - totalCRA - totalAllowableDeductions;
  taxableIncome = Math.max(0, taxableIncome);

  // 4. Calculate Tax per Band
  let remainingTaxable = taxableIncome;
  let totalAnnualTax = 0;
  const bands: TaxBandResult[] = [];

  for (const band of TAX_BANDS) {
    if (remainingTaxable <= 0) {
      bands.push({
        label: band.label,
        rate: band.rate,
        taxableAmount: 0,
        taxPayable: 0
      });
      continue;
    }

    const amountInBand = Math.min(remainingTaxable, band.limit);
    const taxInBand = amountInBand * band.rate;
    
    bands.push({
      label: band.label,
      rate: band.rate,
      taxableAmount: amountInBand,
      taxPayable: taxInBand
    });

    totalAnnualTax += taxInBand;
    remainingTaxable -= amountInBand;
  }

  const monthlyTax = totalAnnualTax / 12;
  const netMonthlyIncome = inputs.monthlyGrossIncome - monthlyTax;

  return {
    annualGross,
    cra: totalCRA,
    allowableDeductions: totalAllowableDeductions,
    taxableIncome,
    annualTax: totalAnnualTax,
    monthlyTax,
    netMonthlyIncome,
    bands
  };
};
