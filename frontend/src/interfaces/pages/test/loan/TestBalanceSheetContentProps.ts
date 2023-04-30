import { BalanceProps } from "interfaces/BalanceProps"
import { BusinessProps } from "interfaces/BusinessProps"

interface TestBalanceSheetContentBaseProps {
  screen: any
  business?: BusinessProps
}

export interface TestBalanceSheetPlaceholderStateProps
  extends TestBalanceSheetContentBaseProps {
  isRequested: boolean
}

export interface TestBalanceSheetQueriedStateProps
  extends TestBalanceSheetContentBaseProps {
  balances?: BalanceProps[] | undefined
}

export interface TestBalanceSheetContentProps
  extends TestBalanceSheetPlaceholderStateProps,
    TestBalanceSheetQueriedStateProps {}
