import { NextApiRequest, NextApiResponse } from "next"

import { setCookie } from "lib/cookies"
import { retrieveUserByEmail } from "lib/backend"

import { RetrieveUserInfoProps } from "interfaces/api/RetrieveUserInfoProps"
import { UserProps } from "interfaces/UserProps"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.query.email
  await retrieveUserInfo({ email, res })
}

const retrieveUserInfo = async ({ email, res }: RetrieveUserInfoProps) => {
  try {
    const response: UserProps = await retrieveUserByEmail(email)
    setCookie(res, "user", JSON.stringify(response))
    res.json(response)
  } catch (error) {
    throw error
  }
}

export default handler
