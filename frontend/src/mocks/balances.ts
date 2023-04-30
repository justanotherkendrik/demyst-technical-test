import dayjs from "dayjs"
import { BalanceProps } from "interfaces/BalanceProps"

const currDate = dayjs()

const baseBalance: BalanceProps = {
  profit_or_loss: 1000,
  assets_value: 1000,
  timestamp: currDate.toString(),
}

export const mockBalance1 = {
  ...baseBalance,
  timestamp: currDate.subtract(1, "month").toString(),
}

export const mockBalance2 = {
  ...baseBalance,
  profit_or_loss: -1000,
  timestamp: currDate.subtract(2, "month").toString(),
}

export const mockBalance3 = {
  ...baseBalance,
  assets_value: -1000,
  timestamp: currDate.subtract(3, "month").toString(),
}

export const mockBalances = [mockBalance1, mockBalance2, mockBalance3]
