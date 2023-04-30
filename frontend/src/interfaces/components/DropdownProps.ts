import { BusinessProps } from "../BusinessProps"
import { ProviderProps } from "../ProviderProps"

export interface GenericDropdownProps {
    error: boolean
    value: number | string
    handleSelect: (event: any) => void
    itemList: BusinessProps[] | ProviderProps[] | any[]
}

export interface EntityTypedDropdownProps extends GenericDropdownProps {
    type: string
}
