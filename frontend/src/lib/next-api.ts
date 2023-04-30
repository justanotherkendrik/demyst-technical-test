import axios from "axios"

export const retrieveUserDetailsWithEmail = async (email: string) => {
  try {
    const response = (await axios.get(`/api/users?email=${email}`)).data
    return response
  } catch (error) {
    throw error
  }
}

export const retrieveBusinessBalanceSheet = async (id: string | number) => {
  try {
    const response = (await axios.get(`/api/businesses/${id}/balances`)).data
    return response
  } catch (error) {
    throw error
  }
}
