import { BusinessProps } from "interfaces/BusinessProps"

const baseMockBusiness: BusinessProps = {
  id: 1,
  name: "Test Business",
  year_established: 2021,
  asset_value: 1000000,
}

export const mockBusinessWithPositiveAssetValue: BusinessProps = {
  ...baseMockBusiness,
}

export const mockBusinessWithNegativeAssetValue: BusinessProps = {
  ...baseMockBusiness,
  id: 2,
  name: "Test Business 2",
  asset_value: -1000000,
}

export const mockBusinessWithNoAssetValue: BusinessProps = {
  ...baseMockBusiness,
  id: 3,
  name: "Test Business 3",
  asset_value: 0,
}

export const mockBusinesses: BusinessProps[] = [
  mockBusinessWithPositiveAssetValue,
  mockBusinessWithNegativeAssetValue,
  mockBusinessWithNoAssetValue,
]
