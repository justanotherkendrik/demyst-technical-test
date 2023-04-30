import axios from "axios"

import { render, fireEvent, act, within } from "@testing-library/react"
import UserEvent from "@testing-library/user-event"

import LoanPage from "./loan"
import { mockUser } from "../mocks/users"
import {
  mockBusinessWithPositiveAssetValue,
  mockBusinesses,
} from "../mocks/businesses"
import { mockProvider1, mockProviders } from "../mocks/accounting_providers"
import { BusinessProps } from "interfaces/BusinessProps"
import { ProviderProps } from "interfaces/ProviderProps"
import { mockBalances } from "mocks/balances"
import {
  FillLoanAmountProps,
  RetrieveBalanceSheetProps,
  SelectEntityFromDropdownProps,
  SubmitLoanRequestProps,
} from "interfaces/pages/test/loan/ActionLoanFormProps"
import {
  TestEntityDropdownProps,
  TestLoanAmountActionProps,
  TestSubmitLoanRequestButtonStateProps,
} from "interfaces/pages/test/loan/TestLoanFormProps"
import {
  TestBalanceSheetContentProps,
  TestBalanceSheetPlaceholderStateProps,
  TestBalanceSheetQueriedStateProps,
} from "interfaces/pages/test/loan/TestBalanceSheetContentProps"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

interface RetrieveBalanceSheetInvalidUserInputTestCase {
  expectation: string
  amount?: number
  business?: BusinessProps
  provider?: ProviderProps
  feedback: string[]
}

const retrieveBalanceSheetInvalidUserInputTestCases: RetrieveBalanceSheetInvalidUserInputTestCase[] =
  [
    {
      expectation: "should have a feedback error for a zero amount",
      amount: 0,
      business: mockBusinessWithPositiveAssetValue,
      provider: mockProvider1,
      feedback: ["Amount must be a positive number!"],
    },
    {
      expectation: "should have a feedback error for a negative amount",
      amount: -500,
      business: mockBusinessWithPositiveAssetValue,
      provider: mockProvider1,
      feedback: ["Amount must be a positive number!"],
    },
    {
      expectation:
        "should have a feedback error for at least one invalid select field",
      amount: 100,
      feedback: ["You must select a business!", "You must select a provider!"],
    },
  ]

const fillLoanAmountAction = async ({
  screen,
  amount,
}: FillLoanAmountProps) => {
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

const retrieveBalanceSheetAction = ({ screen }: RetrieveBalanceSheetProps) => {
  const retrieveBalanceSheetButton = screen.getByTestId("retrieve")
  fireEvent.click(retrieveBalanceSheetButton)
}

const submitLoanRequestAction = ({ screen }: SubmitLoanRequestProps) => {
  const submitLoanRequestButton = screen.getByTestId("submit")
  fireEvent.click(submitLoanRequestButton)
}

const testLoanAmountAction = ({
  screen,
  amount,
}: TestLoanAmountActionProps) => {
  fillLoanAmountAction({ screen, amount })

  const loanAmountField = screen.getByTestId("amount").querySelector("input")
  expect(parseFloat(loanAmountField.value)).toBe(amount)
}

const testEntityDropdown = async ({
  screen,
  entity,
  testId,
}: TestEntityDropdownProps) => {
  await selectEntityFromDropdownAction({ screen, entity, testId })

  const selectField = screen.getByTestId(testId)
  expect(selectField).toHaveTextContent(entity.name)
  expect(selectField.querySelector("input")!.value).toBe(entity.id.toString())
}

const testSubmitButtonState = ({
  screen,
  disabled,
}: TestSubmitLoanRequestButtonStateProps) => {
  const submitLoanRequestButton = screen.getByTestId("submit")
  expect(submitLoanRequestButton).toBeInTheDocument()
  if (disabled) {
    expect(submitLoanRequestButton).toHaveAttribute("disabled")
  } else {
    expect(submitLoanRequestButton).not.toHaveAttribute("disabled")
  }
}

const testBalanceSheetContent = ({
  screen,
  business,
  balances,
  isRequested = false,
}: TestBalanceSheetContentProps) => {
  testBalanceSheetPlaceholderState({ screen, business, isRequested })

  if (isRequested) {
    testBalanceSheetQueriedState({ screen, business, balances })
  }
}

const testBalanceSheetPlaceholderState = ({
  screen,
  isRequested = false,
}: TestBalanceSheetPlaceholderStateProps) => {
  const placeholderText =
    "Fill in your loan request details to see the balance sheet of the business!"
  if (!isRequested) {
    expect(screen.queryByText(placeholderText)).toBeInTheDocument()
  } else {
    expect(screen.queryByText(placeholderText)).not.toBeInTheDocument()
  }
}

const testBalanceSheetQueriedState = ({
  screen,
  business,
}: TestBalanceSheetQueriedStateProps) => {
  const placeholderText = `Here is the requested balance sheet for ${business?.name} for the past 12 months.`
  expect(screen.queryByText(placeholderText)).toBeInTheDocument()
}

describe("LoanPage", () => {
  it("should render the first time with the necessary components", async () => {
    const screen = render(
      <LoanPage
        user={mockUser}
        businesses={mockBusinesses}
        providers={mockProviders}
      />
    )

    const alertText = screen.queryByText("Your loan request was successful!")
    expect(alertText).not.toBeInTheDocument()

    const testIds = ["amount", "business", "provider", "retrieve"]
    testIds.forEach((testId) => {
      const field = screen.getByTestId(testId)
      expect(field).toBeInTheDocument()
    })
    testSubmitButtonState({ screen, disabled: true })

    testBalanceSheetContent({
      screen,
      isRequested: false,
    })
  })

  it.each(retrieveBalanceSheetInvalidUserInputTestCases)(
    `"$expectation"`,
    async ({
      expectation,
      amount,
      business,
      provider,
      feedback,
    }: RetrieveBalanceSheetInvalidUserInputTestCase) => {
      const screen = render(
        <LoanPage
          user={mockUser}
          businesses={mockBusinesses}
          providers={mockProviders}
        />
      )

      if (amount !== undefined) {
        testLoanAmountAction({ screen, amount })
      }

      if (business !== undefined) {
        await testEntityDropdown({
          screen,
          entity: business,
          testId: "business",
        })
      }

      if (provider !== undefined) {
        await testEntityDropdown({
          screen,
          entity: provider,
          testId: "provider",
        })
      }

      retrieveBalanceSheetAction({ screen })
      testSubmitButtonState({ screen, disabled: true })

      Object.values(feedback).forEach((statement) => {
        const feedbackStatement = screen.getByText(statement)
        expect(feedbackStatement).toBeInTheDocument()
      })
    }
  )

  it("should retrieve the balance sheet successfully for a valid user request", async () => {
    const screen = render(
      <LoanPage
        user={mockUser}
        businesses={mockBusinesses}
        providers={mockProviders}
      />
    )

    testLoanAmountAction({ screen, amount: 500 })
    await testEntityDropdown({
      screen,
      entity: mockBusinessWithPositiveAssetValue,
      testId: "business",
    })
    await testEntityDropdown({
      screen,
      entity: mockProvider1,
      testId: "provider",
    })

    const mockExpectedValue = {
      data: {
        balance_sheet: mockBalances,
        business: mockBusinessWithPositiveAssetValue,
      },
    }
    mockedAxios.get.mockResolvedValueOnce(mockExpectedValue)

    await act(async () => {
      retrieveBalanceSheetAction({ screen })
    })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/businesses/${mockBusinessWithPositiveAssetValue.id}/balances`
    )

    testBalanceSheetContent({
      screen,
      business: mockBusinessWithPositiveAssetValue,
      balances: mockBalances,
      isRequested: true,
    })
    testSubmitButtonState({ screen, disabled: false })
  })

  it("should only be able to send a loan to the backend if a balance sheet was successfully retrieved", async () => {
    const screen = render(
      <LoanPage
        user={mockUser}
        businesses={mockBusinesses}
        providers={mockProviders}
      />
    )

    fillLoanAmountAction({ screen, amount: 500 })
    await selectEntityFromDropdownAction({
      screen,
      entity: mockBusinessWithPositiveAssetValue,
      testId: "business",
    })
    await selectEntityFromDropdownAction({
      screen,
      entity: mockProvider1,
      testId: "provider",
    })

    const mockBalanceSheetResponse = {
      data: {
        balance_sheet: mockBalances,
        business: mockBusinessWithPositiveAssetValue,
      },
    }
    mockedAxios.get.mockResolvedValueOnce(mockBalanceSheetResponse)

    await act(async () => {
      retrieveBalanceSheetAction({ screen })
    })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/businesses/${mockBusinessWithPositiveAssetValue.id}/balances`
    )

    const finalAssessmentValue = 0.2
    const loanValue = 500 * finalAssessmentValue
    const mockSubmitLoanRequestResponse = {
      data: {
        loan_amount: loanValue,
        assessment_value: finalAssessmentValue,
      },
    }

    mockedAxios.post.mockResolvedValueOnce(mockSubmitLoanRequestResponse)

    testSubmitButtonState({ screen, disabled: false })

    await act(async () => {
      submitLoanRequestAction({ screen })
    })

    const loanResponseAlertText = screen.queryByText(
      "Your loan request was successful!"
    )
    const loanResponseAlertInfo = screen.queryByText(
      `You successfully managed to get a loan of ${loanValue} at ${
        finalAssessmentValue * 100
      }% of your initial loan amount!`
    )
    expect(loanResponseAlertText).toBeInTheDocument()
    expect(loanResponseAlertInfo).toBeInTheDocument()
  })
})
