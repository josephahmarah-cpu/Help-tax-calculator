
export const TAX_BANDS = [
  { limit: 800000, rate: 0.00, label: 'First ₦800,000' },
  { limit: 2199999, rate: 0.15, label: 'Next ₦2,199,999 (Up to ₦2.99m)' },
  { limit: 9000000, rate: 0.18, label: 'Next ₦9,000,000 (Up to ₦11.99m)' },
  { limit: 13000000, rate: 0.21, label: 'Next ₦13,000,000 (Up to ₦24.99m)' },
  { limit: 25000000, rate: 0.23, label: 'Next ₦25,000,000 (Up to ₦49.99m)' },
  { limit: Infinity, rate: 0.25, label: 'Above ₦50,000,000' }
];

export const EDUCATIONAL_TIPS = [
  {
    title: "What is PAYE?",
    content: "Pay As You Earn (PAYE) is a method of collecting Personal Income Tax (PIT) from employees' salaries and wages by their employers."
  },
  {
    title: "Consolidated Relief Allowance (CRA)",
    content: "CRA is a tax-free allowance given to every taxpayer. It consists of the higher of ₦200,000 or 1% of gross income, plus 20% of the gross income."
  },
  {
    title: "Allowable Deductions",
    content: "These include contributions to the Pension Fund, National Health Insurance Scheme (NHIS), and National Housing Fund (NHF), which are deducted before tax is calculated."
  },
  {
    title: "Tax Residency",
    content: "You are liable to pay tax in Nigeria if you reside in the country for 183 days or more in a 12-month period."
  }
];
