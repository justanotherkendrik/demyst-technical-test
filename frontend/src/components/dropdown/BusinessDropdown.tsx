import Dropdown from "./Dropdown"

import { GenericDropdownProps } from "interfaces/components/DropdownProps"

const BusinessDropdown = (props: GenericDropdownProps) => {
  return <Dropdown {...props} type="Business" />
}

export default BusinessDropdown
