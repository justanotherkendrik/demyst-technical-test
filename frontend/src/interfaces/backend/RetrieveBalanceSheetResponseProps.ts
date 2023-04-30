import { BalanceProps } from "../BalanceProps"

export interface RetrieveBusinessBalanceRequestProps {
    id: number
}

export interface RetrieveBalanceSheetResponseProps {
    balance_sheet: BalanceProps[]
    business: any
}

export const defaultBalanceSheetResponseProps = {
    balance_sheet: [],
    business: null
}