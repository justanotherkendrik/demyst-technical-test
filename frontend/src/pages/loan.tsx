import { useState } from "react"

import { Grid } from "@mui/material"

import LoanForm from "components/LoanForm"

import BalanceSheet from "components/BalanceSheet"
import { BalanceProps } from "interfaces/BalanceProps"

import { retrieveAccountingProviders, retrieveBusinesses } from "lib/backend"
import {
  LoanResultProps,
  defaultLoanResultProps,
} from "interfaces/LoanResultProps"
import LoanResultAlert from "components/LoanResultAlert"
import {
  HandleRetrieveBalanceSheetProps,
  LoanPageProps,
} from "interfaces/pages/LoanPageProps"
import { defaultBalanceSheetResponseProps } from "interfaces/backend/RetrieveBalanceSheetResponseProps"
import { retrieveBusinessBalanceSheet } from "lib/next-api"

const LoanPage = ({ user, businesses, providers }: LoanPageProps) => {
  const emptyBalanceSheet: BalanceProps[] = []
  const [loanAmount, setLoanAmount] = useState(0)

  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [balanceSheet, setBalanceSheet] = useState(emptyBalanceSheet)
  const [isBalanceSheetRequested, setIsBalanceSheetRequested] = useState(false)
  const [enableSubmit, setEnableSubmit] = useState(false)

  const [loanResult, setLoanResult] = useState(defaultLoanResultProps)
  const [openLoanResultAlert, setOpenLoanResultAlert] = useState(false)

  const handleCloseAlert = () => {
    setOpenLoanResultAlert(false)
  }

  const handleRetrieveBusinessBalanceSheet = async ({
    id,
    loan,
  }: HandleRetrieveBalanceSheetProps) => {
    let result = defaultBalanceSheetResponseProps
    try {
      result = await retrieveBusinessBalanceSheet(id)
    } catch (error) {
      console.error("Error occurred while retrieving balance sheet: ", error)
      return {
        redirect: {
          destination: "/500",
        },
      }
    }

    const { balance_sheet, business } = result

    setLoanAmount(loan)
    setSelectedBusiness(business)
    setBalanceSheet(balance_sheet)
    setIsBalanceSheetRequested(true)
    setEnableSubmit(true)
  }

  const handleSubmitLoanForm = (response: LoanResultProps) => {
    setLoanResult(response)
    setOpenLoanResultAlert(true)
  }

  return (
    <Grid
      container
      sx={{
        height: "inherit",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        p: 2,
      }}
      spacing={2}
    >
      <Grid item xs={12} md={8} sx={{ width: "100%" }}>
        {openLoanResultAlert && (
          <LoanResultAlert closeAlert={handleCloseAlert} {...loanResult} />
        )}
      </Grid>

      <Grid
        item
        columnGap={2}
        rowGap={2}
        xs={12}
        md={8}
        sx={{
          height: "fit-content",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={6} sx={{ width: "inherit" }}>
          <LoanForm
            user={user}
            businesses={businesses}
            providers={providers}
            enableSubmit={enableSubmit}
            handleRetrieveBusinessBalanceSheet={
              handleRetrieveBusinessBalanceSheet
            }
            handleSubmitLoanForm={handleSubmitLoanForm}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: "inherit" }}>
          <BalanceSheet
            isBalanceSheetRequested={isBalanceSheetRequested}
            balances={balanceSheet}
            business={selectedBusiness}
            loan={loanAmount}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const { user } = context.req.cookies
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: true,
        },
      }
    }

    const userJson = JSON.parse(user)
    const businesses = await retrieveBusinesses()
    const providers = await retrieveAccountingProviders()
    return { props: { user: userJson, ...businesses, ...providers } }
  } catch (error) {
    console.error("Error retrieving information: ", error)
    return {
      redirect: {
        destination: "/500",
      },
    }
  }
}

export default LoanPage
