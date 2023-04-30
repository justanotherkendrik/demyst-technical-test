import axios from "axios"

import { CreateLoanProps } from "interfaces/backend/CreateLoanProps"
import { RetrieveBusinessBalanceRequestProps } from "interfaces/backend/RetrieveBalanceSheetResponseProps"

export const retrieveUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/users?email=${email}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const retrieveBusinesses = async () => {
  try {
    const response = await axios.get(`${process.env.API_URL}/businesses`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const retrieveAccountingProviders = async () => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/accounting_providers`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const retrieveBusinessBalance = async ({
  id,
}: RetrieveBusinessBalanceRequestProps) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/businesses/${id}/balances`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const createLoan = async (props: CreateLoanProps) => {
  try {
    const response = await axios.post(`${process.env.API_URL}/loans`, props)
    return response.data
  } catch (error) {
    throw error
  }
}
