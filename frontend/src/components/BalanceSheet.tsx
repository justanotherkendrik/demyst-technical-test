import { BalanceProps } from "interfaces/BalanceProps"
import { BalanceSheetProps } from "interfaces/components/BalanceSheetProps"

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material"

const BalanceSheet = ({
  isBalanceSheetRequested,
  balances,
  business,
  loan,
}: BalanceSheetProps) => {
  const existingAssetValue = business?.asset_value ?? 0

  return (
    <Paper
      sx={{
        height: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      {isBalanceSheetRequested && (
        <>
          <Stack spacing={1} p={2}>
            <Stack direction="row" spacing={2} justifyContent="space-evenly">
              <Box textAlign="center" data-testid="before-loan">
                <Typography variant="subtitle1">
                  Balance before loan:
                </Typography>
                <Typography variant="h6">{`\$${existingAssetValue}`}</Typography>
              </Box>

              <Box textAlign="center" data-testid="after-loan">
                <Typography variant="subtitle1">Balance after loan:</Typography>
                <Typography variant="h6">{`\$${
                  existingAssetValue + loan
                }`}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Typography variant="subtitle2">
              {`Here is the requested balance sheet for ${business?.name} for the past 12 months.`}
            </Typography>
          </Stack>
          <List
            sx={{ p: 2, width: "100%", height: "400px", overflow: "auto" }}
            data-testid="balance-list"
          >
            {balances.map((balance: BalanceProps) => {
              return (
                <ListItem
                  key={balance.timestamp}
                  data-testid="balance-list-item"
                  sx={{ display: "block", width: "100%" }}
                >
                  <ListItemText primary={balance.timestamp} />
                  <ListItemText
                    secondary={`Profit: ${balance.profit_or_loss}`}
                  />
                  <ListItemText
                    secondary={`Assets Value: ${balance.assets_value}`}
                  />
                </ListItem>
              )
            })}
          </List>
        </>
      )}
      {!isBalanceSheetRequested && (
        <Box
          sx={{ height: "400px", px: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography textAlign="center">
            Fill in your loan request details to see the balance sheet of the
            business!
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default BalanceSheet
