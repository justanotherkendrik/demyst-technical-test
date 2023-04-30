import { render, within } from "@testing-library/react"

import BalanceSheet from "components/BalanceSheet"
import { BalanceSheetProps } from "interfaces/components/BalanceSheetProps"
import { mockBalance1, mockBalances } from "mocks/balances"
import { mockBusinessWithPositiveAssetValue } from "mocks/businesses"
import { TestLoanBoxStateProps } from "interfaces/components/test/TestLoanBoxStateProps"

const testLoanBoxState = ({ screen, state, value }: TestLoanBoxStateProps) => {
  const loanBox = screen.getByTestId(`${state}-loan`)
  const loanText = within(loanBox).queryByText(`Balance ${state} loan:`)
  const loanAmount = within(loanBox).queryByText(`\$${value}`)

  expect(loanText).toBeInTheDocument()
  expect(loanAmount).toBeInTheDocument()
}

describe("components/BalanceSheet", () => {
  it("should render only a placeholder text if a request has not been made", () => {
    const mockBalanceSheetProps: BalanceSheetProps = {
      isBalanceSheetRequested: false,
      balances: [],
      business: null,
      loan: 0,
    }
    const screen = render(<BalanceSheet {...mockBalanceSheetProps} />)
    const placeholderText =
      "Fill in your loan request details to see the balance sheet of the business!"
    expect(screen.queryByText(placeholderText)).toBeInTheDocument()
  })

  it("should render the necessary components if a request has been made", () => {
    const mockBalanceSheetProps: BalanceSheetProps = {
      isBalanceSheetRequested: true,
      balances: mockBalances,
      business: mockBusinessWithPositiveAssetValue,
      loan: 500,
    }
    const screen = render(<BalanceSheet {...mockBalanceSheetProps} />)
    const placeholderText = `Here is the requested balance sheet for ${mockBusinessWithPositiveAssetValue?.name} for the past 12 months.`
    expect(screen.queryByText(placeholderText)).toBeInTheDocument()

    testLoanBoxState({
      screen,
      state: "before",
      value: mockBusinessWithPositiveAssetValue.asset_value,
    })
    testLoanBoxState({
      screen,
      state: "after",
      value: mockBusinessWithPositiveAssetValue.asset_value + 500,
    })

    const balancesList = screen.getByTestId("balance-list")
    const balanceEntries =
      within(balancesList).getAllByTestId("balance-list-item")
    expect(balanceEntries.length).toEqual(mockBalances.length)

    const balanceEntry = balanceEntries[0]
    const balanceEntryTimeStamp = within(balanceEntry).queryByText(
      mockBalance1.timestamp
    )
    const balanceEntryProfit = within(balanceEntry).queryByText(
      `Profit: ${mockBalance1.profit_or_loss}`
    )
    const balanceEntryAssetsValue = within(balanceEntry).queryByText(
      `Assets Value: ${mockBalance1.assets_value}`
    )
    expect(balanceEntryTimeStamp).toBeInTheDocument()
    expect(balanceEntryProfit).toBeInTheDocument()
    expect(balanceEntryAssetsValue).toBeInTheDocument()
  })
})
