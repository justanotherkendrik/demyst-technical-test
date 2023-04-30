import { fireEvent, render } from "@testing-library/react"

import LoanResultAlert from "components/LoanResultAlert"

const closeAlert = jest.fn()

const mockLoanResultAlertProps = {
  closeAlert,
  loan_amount: 500,
  assessment_value: 1.0,
  loan_result: true,
}

describe("components/LoanResultAlert", () => {
  it("should render the necessary components", () => {
    const screen = render(<LoanResultAlert {...mockLoanResultAlertProps} />)
    const alert = screen.queryByTestId("successful-loan")
    const loanResultText = screen.queryByText(
      "Your loan request was successful!"
    )
    const loanResultDetailedSummary = screen.queryByText(
      `You successfully managed to get a loan of ${500} at ${
        1.0 * 100
      }% of your initial loan amount!`
    )

    expect(alert).toBeInTheDocument()
    expect(loanResultText).toBeInTheDocument()
    expect(loanResultDetailedSummary).toBeInTheDocument()
  })

  it("should call a hook to initiate conditional rendering of the component when closed", () => {
    const screen = render(<LoanResultAlert {...mockLoanResultAlertProps} />)
    const closeButton = screen.getByTitle("Close")
    fireEvent.click(closeButton)

    expect(closeAlert).toHaveBeenCalled()
  })
})
