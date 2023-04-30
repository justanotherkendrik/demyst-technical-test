import { NextApiResponse } from "next"

import { setCookie } from "./cookies"
import { mockUser } from "mocks/users"
import { serialize } from "cookie"

const mockedResponse: jest.Mocked<NextApiResponse> = {
  setHeader: jest.fn(),
} as unknown as jest.Mocked<NextApiResponse>

describe("lib/cookies", () => {
  it("should set a cookie in the API headers", () => {
    const key = "user"
    const value = JSON.stringify(mockUser)
    setCookie(mockedResponse, key, value)

    const serializedData = serialize(key, value, {
      httpOnly: true,
      maxAge: 3600,
      path: "/",
    })

    expect(mockedResponse.setHeader).toBeCalledWith(
      "Set-Cookie",
      serializedData
    )
  })
})
