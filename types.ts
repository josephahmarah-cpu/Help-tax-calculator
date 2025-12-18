
export enum EmploymentType {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED'
}

export interface TaxInputs {
  monthlyGrossIncome: number;
  otherIncome: number;
  employmentType: EmploymentType;
  pensionContribution: number;
  nhfContribution: number;
  otherDeductions: number;
  year: number;
}

export interface TaxBandResult {
  label: string;
  rate: number;
  taxableAmount: number;
  taxPayable: number;
}

export interface TaxCalculationResult {
  annualGross: number;
  cra: number;
  allowableDeductions: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  netMonthlyIncome: number;
  bands: TaxBandResult[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TaxHistoryRecord {
  id: string;
  timestamp: number;
  inputs: TaxInputs;
  summary: {
    monthlyGross: number;
    monthlyTax: number;
    monthlyNet: number;
  };
}
