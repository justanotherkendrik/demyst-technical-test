import { NextApiRequest, NextApiResponse } from "next"

import { retrieveBusinessBalance } from "lib/backend"

import { UserProps } from "interfaces/UserProps"
import { RetrieveBalanceSheetProps } from "interfaces/api/RetrieveBalanceSheetProps"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  await retrieveBalanceSheet({ id: id as string, res })
}

const retrieveBalanceSheet = async ({ id, res }: RetrieveBalanceSheetProps) => {
  try {
    const businessId = parseInt(id)
    const response = await retrieveBusinessBalance({
      id: businessId,
    })
    res.json(response)
  } catch (error) {
    throw error
  }
}

export default handler
