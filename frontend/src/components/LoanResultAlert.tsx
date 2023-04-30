import { Alert, AlertTitle, Typography } from "@mui/material"

import { LoanResultAlertProps } from "interfaces/components/LoanResultAlertProps"

const LoanResultAlert = (props: LoanResultAlertProps) => {
  const {
    closeAlert,
    loan_amount: loanValue,
    assessment_value: finalAssessmentValue,
  } = props

  const onClose = () => {
    closeAlert()
  }

  return (
    <Alert severity="success" onClose={onClose} data-testid="successful-loan">
      <AlertTitle sx={{ fontWeight: 600 }}>
        Your loan request was successful!
      </AlertTitle>
      <Typography>
        {`You successfully managed to get a loan of ${loanValue} at ${
          finalAssessmentValue * 100
        }% of your initial loan amount!`}
      </Typography>
    </Alert>
  )
}

export default LoanResultAlert
