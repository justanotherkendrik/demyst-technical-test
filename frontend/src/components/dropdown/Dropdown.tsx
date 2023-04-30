import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material"

import { EntityTypedDropdownProps } from "interfaces/components/DropdownProps"

const Dropdown = ({
  type,
  error,
  value,
  handleSelect,
  itemList,
}: EntityTypedDropdownProps) => {
  const onChange = (event: any) => {
    handleSelect(event)
  }
  return (
    <Box>
      <FormControl fullWidth error={error} variant="filled">
        <InputLabel>{`${type}`}</InputLabel>
        <Select
          value={value}
          onChange={onChange}
          data-testid={`${type.toLowerCase()}`}
        >
          {itemList.map((item) => {
            return (
              <MenuItem data-testid={item.name} key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      {error && (
        <Typography variant="subtitle2" color="red">
          You must select a {type.toLowerCase()}!
        </Typography>
      )}
    </Box>
  )
}

export default Dropdown
