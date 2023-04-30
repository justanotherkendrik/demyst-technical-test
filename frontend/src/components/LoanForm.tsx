import { useState } from "react"

import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material"

import { createLoan } from "lib/backend"

import { CreateLoanProps } from "interfaces/backend/CreateLoanProps"
import { LoanResultProps } from "interfaces/LoanResultProps"
import { LoanFormProps } from "interfaces/components/LoanFormProps"

import BusinessDropdown from "./dropdown/BusinessDropdown"
import ProviderDropdown from "./dropdown/ProviderDropdown"
import axios from "axios"

const LoanForm = ({
  user,
  businesses,
  providers,
  enableSubmit,
  handleRetrieveBusinessBalanceSheet,
  handleSubmitLoanForm,
}: LoanFormProps) => {
  const [loanAmount, setLoanAmount] = useState(0)
  const [isLoanAmountInvalid, setIsLoanAmountInvalid] = useState(true)

  const [selectedBusiness, setSelectedBusiness] = useState("")
  const [isSelectedBusinessInvalid, setIsSelectedBusinessInvalid] =
    useState(true)

  const [selectedProvider, setSelectedProvider] = useState("")
  const [isSelectedProviderInvalid, setIsSelectedProviderInvalid] =
    useState(true)

  const [isBalanceSheetRequested, setIsBalanceSheetRequested] = useState(false)

  const handleLoanAmountChange = (event: any) => {
    const value = event.target?.value
    setLoanAmount(parseFloat(value))
    if (parseFloat(value) > 0) {
      setIsLoanAmountInvalid(false)
    } else {
      setIsLoanAmountInvalid(true)
    }
  }

  const handleSelectedBusinessChange = (event: any) => {
    const value = event.target?.value
    setSelectedBusiness(value)
    if (value === null || value === undefined || value === "") {
      setIsSelectedBusinessInvalid(true)
    } else {
      setIsSelectedBusinessInvalid(false)
    }
  }

  const handleSelectedProviderChange = (event: any) => {
    const value = event.target?.value
    setSelectedProvider(value)
    if (value === null || value === undefined || value === "") {
      setIsSelectedProviderInvalid(true)
    } else {
      setIsSelectedProviderInvalid(false)
    }
  }

  const isFormValid = () => {
    return (
      !isLoanAmountInvalid &&
      !isSelectedBusinessInvalid &&
      !isSelectedProviderInvalid
    )
  }

  const handleRetrieveBalanceSheet = () => {
    if (isFormValid()) {
      handleRetrieveBusinessBalanceSheet({
        id: selectedBusiness,
        loan: loanAmount,
      })
    }

    setIsBalanceSheetRequested(true)
  }

  const handleSubmit = async () => {
    if (isFormValid()) {
      try {
        const props: CreateLoanProps = {
          business: parseInt(selectedBusiness),
          accounting_provider: parseInt(selectedProvider),
          applicant: user.id,
          amount: loanAmount,
        }

        const response: LoanResultProps = (
          await axios.post("/api/loans", props)
        ).data

        handleSubmitLoanForm(response)
      } catch (error) {
        console.log(error)
        console.error("Error submitting form: ", error)
        return {
          redirect: {
            destination: "/500", // ensure there is a redirection first.
          },
        }
      }
    }
  }

  return (
    <Paper
      sx={{
        height: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <Stack p={2} spacing={2} component="form" noValidate autoComplete="off">
        <Box textAlign="center" data-testid="user-info">
          <Typography variant="h5">
            {`Welcome back, ${user.display_name}!`}
          </Typography>
          <Typography variant="subtitle2">
            Fill in the details below to make a loan:
          </Typography>
        </Box>

        <Box>
          <TextField
            data-testid="amount"
            required
            error={isLoanAmountInvalid && isBalanceSheetRequested}
            label="Amount ($)"
            type="numeric"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            sx={{ width: "100%" }}
          />
          {isLoanAmountInvalid && isBalanceSheetRequested && (
            <Typography variant="subtitle2" color="red">
              Amount must be a positive number!
            </Typography>
          )}
        </Box>

        <BusinessDropdown
          error={isSelectedBusinessInvalid && isBalanceSheetRequested}
          value={selectedBusiness}
          handleSelect={handleSelectedBusinessChange}
          itemList={businesses}
        />
        <ProviderDropdown
          error={isSelectedProviderInvalid && isBalanceSheetRequested}
          value={selectedProvider}
          handleSelect={handleSelectedProviderChange}
          itemList={providers}
        />

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={handleRetrieveBalanceSheet}
            data-testid="retrieve"
          >
            Retrieve Balance Sheet
          </Button>
          <Button
            variant="contained"
            disabled={!enableSubmit}
            onClick={handleSubmit}
            data-testid="submit"
            color="success"
          >
            Submit Loan
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default LoanForm
