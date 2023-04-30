import { BusinessProps } from "../BusinessProps"
import { ProviderProps } from "../ProviderProps"
import { UserProps } from "../UserProps"

import { RetrieveBusinessBalanceRequestProps } from "../backend/RetrieveBalanceSheetResponseProps"

export interface LoanPageProps {
    providers: ProviderProps[]
    businesses: BusinessProps[]
    user: UserProps
}

export interface HandleRetrieveBalanceSheetProps extends RetrieveBusinessBalanceRequestProps {
    loan: number
}
