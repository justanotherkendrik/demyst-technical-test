import axios from "axios"

import { render, fireEvent } from "@testing-library/react"

import LoginPage from "./login"

jest.mock("axios")

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValueOnce({ push: jest.fn() }),
}))

describe("LoginPage", () => {
  it("should render with a login button that calls the Next API on click", async () => {
    const { getByRole } = render(<LoginPage />)

    const button = getByRole("button")
    expect(button).not.toBeNull()

    const result = fireEvent.click(button)
    expect(result).toBe(true)
    expect(axios.get).toHaveBeenCalledWith(
      "/api/users?email=test_user@email.com"
    )
  })
})
