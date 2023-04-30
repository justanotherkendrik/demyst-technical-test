import { LoanResultProps, defaultLoanResultProps } from "../LoanResultProps"

export interface LoanResultAlertProps extends LoanResultProps {
    closeAlert: () => void
}

export const defaultLoanResultAlertProps: LoanResultAlertProps = {
    ...defaultLoanResultProps, closeAlert: () => {}

}