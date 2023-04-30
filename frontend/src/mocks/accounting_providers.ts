import { ProviderProps } from "interfaces/ProviderProps"

const baseMockBusiness: ProviderProps = {
  id: 1,
  name: "Test Provider 0",
}

export const mockProvider1: ProviderProps = {
  ...baseMockBusiness,
  name: "Test Provider 1",
}

export const mockProvider2: ProviderProps = {
  ...baseMockBusiness,
  id: 2,
  name: "Test Provider 2",
}

export const mockProviders: ProviderProps[] = [mockProvider1, mockProvider2]
