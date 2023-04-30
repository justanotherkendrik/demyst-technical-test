import { BusinessProps } from "interfaces/BusinessProps"
import { ProviderProps } from "interfaces/ProviderProps"

interface TestLoanFormProps {
  screen: any
}

export interface TestLoanAmountActionProps extends TestLoanFormProps {
  amount: number
}

export interface TestEntityDropdownProps extends TestLoanFormProps {
  entity: BusinessProps | ProviderProps
  testId: string
}

export interface TestSubmitLoanRequestButtonStateProps
  extends TestLoanFormProps {
  disabled: boolean
}
