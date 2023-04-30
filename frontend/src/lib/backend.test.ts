import { mockUser } from "mocks/users"
import {
  createLoan,
  retrieveAccountingProviders,
  retrieveBusinessBalance,
  retrieveBusinesses,
  retrieveUserByEmail,
} from "./backend"

import axios from "axios"
import {
  mockBusinessWithPositiveAssetValue,
  mockBusinesses,
} from "mocks/businesses"
import { mockProviders } from "mocks/accounting_providers"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

interface TestBackendLibraryFunctionsMockedInputProps {
  query?: any
  params?: object
  body?: object
}

interface TestBackendLibraryFunctionsProps {
  url: string
  description: string
  mockedInput?: TestBackendLibraryFunctionsMockedInputProps
  mockExpectedResult: any
  axiosFunc: any
  func: any
}

const testBackendLibraryFunctions = async ({
  url,
  mockedInput,
  func,
  axiosFunc,
  mockExpectedResult,
}: TestBackendLibraryFunctionsProps) => {
  axiosFunc.mockResolvedValueOnce({ data: mockExpectedResult })
  const funcInput =
    mockedInput?.query ?? mockedInput?.params ?? mockedInput?.body
  const actualResponse = !!mockedInput ? await func(funcInput) : await func()

  if (!!mockedInput?.body) {
    expect(axiosFunc).toHaveBeenCalledWith(url, mockedInput.body)
  } else {
    expect(axiosFunc).toHaveBeenCalledWith(url)
  }

  expect(actualResponse).toEqual(mockExpectedResult)
}

const backendTestFunctions = [
  {
    url: `http://localhost:8080/users?email=${mockUser.email}`,
    description:
      "retrieveUserByEmail should retrieve user information from API using user email",
    mockedInput: { query: mockUser.email },
    func: retrieveUserByEmail,
    axiosFunc: mockedAxios.get,
    mockExpectedResult: mockUser,
  },
  {
    url: "http://localhost:8080/businesses",
    description: "retrieveBusinesses should retrieve businesses from API",
    func: retrieveBusinesses,
    axiosFunc: mockedAxios.get,
    mockExpectedResult: mockBusinesses,
  },
  {
    url: "http://localhost:8080/accounting_providers",
    description:
      "retrieveAccountingProviders should retrieve accounting providers from API",
    func: retrieveAccountingProviders,
    axiosFunc: mockedAxios.get,
    mockExpectedResult: mockProviders,
  },
  {
    url: `http://localhost:8080/businesses/${mockBusinessWithPositiveAssetValue.id}/balances`,
    description:
      "retrieveBusinessBalance should retrieve balance sheet from API for a given business identifier",
    mockedInput: { params: { id: mockBusinessWithPositiveAssetValue.id } },
    func: retrieveBusinessBalance,
    axiosFunc: mockedAxios.get,
    mockExpectedResult: [],
  },
  {
    url: `http://localhost:8080/loans`,
    description:
      "createLoan should create a loan using the API for a given request body",
    mockedInput: {
      body: { business: 1, accounting_provider: 1, applicant: 1, amount: 500 },
    },
    func: createLoan,
    axiosFunc: mockedAxios.post,
    mockExpectedResult: {
      loan_amount: 100,
      assessment_value: 0.2,
      loan_result: true,
    },
  },
]

describe("lib/backend", () => {
  it.each(backendTestFunctions)(
    "successful test cases: $description",
    async (props: TestBackendLibraryFunctionsProps) => {
      await testBackendLibraryFunctions(props)
    }
  )
})
