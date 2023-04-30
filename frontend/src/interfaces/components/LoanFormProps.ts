import { LoanResultProps } from "../LoanResultProps"
import { LoanPageProps } from "../pages/LoanPageProps"

export interface LoanFormProps extends LoanPageProps {
  enableSubmit: boolean
  handleRetrieveBusinessBalanceSheet: (props: any) => void
  handleSubmitLoanForm: (props: LoanResultProps) => void
}
