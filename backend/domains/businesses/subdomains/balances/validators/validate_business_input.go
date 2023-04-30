package balances_validators

import (
	"strconv"
)

func ValidateBusinessInput(inputBusiness string) bool {
	if inputBusiness == "" {
		return false
	}
	_, err := strconv.Atoi(inputBusiness)
	if err != nil {
		return false
	}

	return true
}
