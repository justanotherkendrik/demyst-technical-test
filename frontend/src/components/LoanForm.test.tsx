import { act, fireEvent, render, within } from "@testing-library/react"
import UserEvent from "@testing-library/user-event"

import LoanForm from "components/LoanForm"
import { mockUser } from "mocks/users"
import {
  mockBusinessWithPositiveAssetValue,
  mockBusinesses,
} from "mocks/businesses"
import { mockProvider1, mockProviders } from "mocks/accounting_providers"
import { LoanFormProps } from "interfaces/components/LoanFormProps"
import {
  FillLoanAmountProps,
  SelectEntityFromDropdownProps,
} from "interfaces/pages/test/loan/ActionLoanFormProps"
import { ActionFillLoanFormProps } from "interfaces/components/test/ActionFillLoanFormProps"

const handleRetrieveBusinessBalanceSheet = jest.fn()
const handleSubmitLoanForm = jest.fn()

const mockLoanFormDefaultProps: LoanFormProps = {
  user: mockUser,
  businesses: mockBusinesses,
  providers: mockProviders,
  enableSubmit: false,
  handleRetrieveBusinessBalanceSheet,
  handleSubmitLoanForm,
}

const fillLoanAmountAction = ({ screen, amount }: FillLoanAmountProps) => {
  const loanAmountField = screen.getByTestId("amount").querySelector("input")
  expect(loanAmountField).not.toBeNull()
  fireEvent.input(loanAmountField, { target: { value: amount.toString() } })
}

const selectEntityFromDropdownAction = async ({
  screen,
  entity,
  testId,
}: SelectEntityFromDropdownProps) => {
  const selectField = screen.getByTestId(testId)
  const selectButton = within(selectField).getByRole("button")
  UserEvent.click(selectButton)

  const dropdownItem = await screen.findByTestId(entity.name)
  fireEvent.click(dropdownItem)
}

const fillLoanFormAction = async ({
  screen,
  businessEntity,
  providerEntity,
  amount,
}: ActionFillLoanFormProps) => {
  fillLoanAmountAction({ screen, amount })
  await selectEntityFromDropdownAction({
    screen,
    entity: businessEntity,
    testId: "business",
  })
  await selectEntityFromDropdownAction({
    screen,
    entity: providerEntity,
    testId: "provider",
  })
}

describe("components/LoanForm", () => {
  it("should render the necessary components", () => {
    const screen = render(<LoanForm {...mockLoanFormDefaultProps} />)

    const userInfoBox = screen.getByTestId("user-info")
    const welcomeText = within(userInfoBox).queryByText(
      `Welcome back, ${mockUser.display_name}!`
    )
    const formInfoText = within(userInfoBox).queryByText(
      "Fill in the details below to make a loan:"
    )
    expect(welcomeText).toBeInTheDocument()
    expect(formInfoText).toBeInTheDocument()

    const testIds = ["amount", "business", "provider", "retrieve", "submit"]
    testIds.forEach((testId) => {
      const component = screen.getByTestId(testId)
      expect(component).toBeInTheDocument()

      if (testId === "submit") {
        expect(component).toHaveAttribute("disabled")
      }
    })
  })

  it("should not call input function to retrieve balance sheet if form inputs are invalid", async () => {
    const screen = render(<LoanForm {...mockLoanFormDefaultProps} />)

    const retrieveBalanceSheetButton = screen.getByTestId("retrieve")
    const submitLoanRequestButton = screen.getByTestId("submit")

    await act(async () => {
      fireEvent.click(retrieveBalanceSheetButton)
    })

    expect(handleRetrieveBusinessBalanceSheet).not.toHaveBeenCalled()
    expect(submitLoanRequestButton).toHaveAttribute("disabled")

    const errorFeedbackTexts = [
      "Amount must be a positive number!",
      "You must select a business!",
      "You must select a provider!",
    ]

    errorFeedbackTexts.forEach((errorFeedbackText) => {
      const component = screen.getByText(errorFeedbackText)
      expect(component).toBeInTheDocument()
    })
  })

  it("should call input function to retrieve balance sheet if form inputs are valid", async () => {
    const screen = render(<LoanForm {...mockLoanFormDefaultProps} />)

    await fillLoanFormAction({
      screen,
      amount: 500,
      businessEntity: mockBusinessWithPositiveAssetValue,
      providerEntity: mockProvider1,
    })

    await act(async () => {
      const retrieveBalanceSheetButton = screen.getByTestId("retrieve")
      fireEvent.click(retrieveBalanceSheetButton)
    })
    expect(handleRetrieveBusinessBalanceSheet).toHaveBeenCalled()
  })

  it("should have ability to submit loan request if enabled", async () => {
    const mockLoanFormSubmittableProps = {
      ...mockLoanFormDefaultProps,
      enableSubmit: true,
    }
    const screen = render(<LoanForm {...mockLoanFormSubmittableProps} />)

    await fillLoanFormAction({
      screen,
      amount: 500,
      businessEntity: mockBusinessWithPositiveAssetValue,
      providerEntity: mockProvider1,
    })

    await act(async () => {
      const retrieveBalanceSheetButton = screen.getByTestId("retrieve")
      fireEvent.click(retrieveBalanceSheetButton)
    })
    expect(handleRetrieveBusinessBalanceSheet).toHaveBeenCalled()

    const submitLoanRequestButton = screen.getByTestId("submit")
    expect(submitLoanRequestButton).not.toHaveAttribute("disabled")
    await act(async () => {
      expect(fireEvent.click(submitLoanRequestButton)).toBe(true)
    })
  })
})
