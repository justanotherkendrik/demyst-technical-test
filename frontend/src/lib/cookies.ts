import { NextApiResponse } from "next"

import { serialize } from "cookie"

export const setCookie = (res: NextApiResponse, key: string, value: any) => {
  const cookie = serialize(key, value, {
    httpOnly: true,
    maxAge: 3600,
    path: "/",
  })
  res.setHeader("Set-Cookie", cookie)
}
