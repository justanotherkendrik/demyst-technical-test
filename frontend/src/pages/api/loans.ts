import { LoanResultProps } from "interfaces/LoanResultProps"
import { CreateLoanRequestProps } from "interfaces/api/CreateLoanRequestProps"
import { CreateLoanProps } from "interfaces/backend/CreateLoanProps"
import { createLoan } from "lib/backend"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const props: CreateLoanProps = req.body
  await createLoanRequest({ props, res })
}

const createLoanRequest = async ({ props, res }: CreateLoanRequestProps) => {
  try {
    const response: LoanResultProps = await createLoan(props)
    res.json(response)
  } catch (error) {
    throw error
  }
}

export default handler
