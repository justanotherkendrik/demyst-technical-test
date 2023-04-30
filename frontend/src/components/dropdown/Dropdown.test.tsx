import { render, within } from "@testing-library/react"

import Dropdown from "./Dropdown"
import { mockBusinesses } from "mocks/businesses"
import { EntityTypedDropdownProps } from "interfaces/components/DropdownProps"

const defaultDropdownProps = {
  error: false,
  handleSelect: jest.fn(),
}

describe("./components/dropdown/Dropdown.tsx", () => {
  it("should render the necessary components for a given type", () => {
    const businessDropdownProps: EntityTypedDropdownProps = {
      ...defaultDropdownProps,
      type: "Business",
      value: "",
      itemList: mockBusinesses,
    }
    const screen = render(<Dropdown {...businessDropdownProps} />)

    const labelValue = screen.queryByText(businessDropdownProps.type)
    expect(labelValue).toBeInTheDocument()

    const errorText = screen.queryByText(
      `You must select a ${businessDropdownProps.type.toLowerCase()}`
    )
    expect(errorText).not.toBeInTheDocument()
  })
})
