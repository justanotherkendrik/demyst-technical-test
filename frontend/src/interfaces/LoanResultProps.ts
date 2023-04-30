export interface LoanResultProps {
  loan_amount: number
  assessment_value: number
  loan_result: boolean
}

export const defaultLoanResultProps: LoanResultProps = {
  loan_amount: 0,
  assessment_value: 1,
  loan_result: true,
}
