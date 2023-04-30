import Dropdown from "./Dropdown"

import { GenericDropdownProps } from "interfaces/components/DropdownProps"

const ProviderDropdown = (props: GenericDropdownProps) => {
  return <Dropdown {...props} type="Provider" />
}

export default ProviderDropdown
