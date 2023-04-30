import { BusinessProps } from "interfaces/BusinessProps"
import { ProviderProps } from "interfaces/ProviderProps"

interface ActionLoanFormActionProps {
  screen: any
}

export interface FillLoanAmountProps extends ActionLoanFormActionProps {
  amount: number
}

export interface SelectEntityFromDropdownProps
  extends ActionLoanFormActionProps {
  entity: BusinessProps | ProviderProps
  testId: string
}

export interface RetrieveBalanceSheetProps extends ActionLoanFormActionProps {}

export interface SubmitLoanRequestProps extends ActionLoanFormActionProps {}
