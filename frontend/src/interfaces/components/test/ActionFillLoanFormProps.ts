import { BusinessProps } from "interfaces/BusinessProps"
import { ProviderProps } from "interfaces/ProviderProps"

export interface ActionFillLoanFormProps {
  screen: any
  businessEntity: BusinessProps
  providerEntity: ProviderProps
  amount: number
}
