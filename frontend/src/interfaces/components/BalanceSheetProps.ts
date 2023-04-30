import { BalanceProps } from "../BalanceProps"
import { BusinessProps } from "../BusinessProps"

export interface BalanceSheetProps {
  isBalanceSheetRequested: boolean
  balances: BalanceProps[]
  business: BusinessProps | null
  loan: number
}
