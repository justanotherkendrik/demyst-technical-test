import { CreateLoanProps } from "interfaces/backend/CreateLoanProps"
import { NextApiResponse } from "next"

export interface CreateLoanRequestProps {
  props: CreateLoanProps
  res: NextApiResponse
}
