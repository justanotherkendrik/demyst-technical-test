package loans

import (
	tests_service "backend/demyst-technical-interview/shared/infrastructure/tests"
	"bytes"
	"encoding/json"
	"io"

	"net/http"
	"net/http/httptest"
	"os"

	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	code := tests_service.RunTestSuite("../../", m)
	os.Exit(code)
}

func TestLoanScenarios(t *testing.T) {
	testCases := []struct {
		test_case     string
		input         map[string]interface{}
		response_code int
	}{
		{
			"Should fail if there is a missing field",
			map[string]interface{}{
				"business":            1000,
				"accounting_provider": 1,
				"amount":              500,
			},
			http.StatusBadRequest,
		},
		{
			"Should fail for an invalid loan amount",
			map[string]interface{}{
				"business":            1,
				"accounting_provider": 2,
				"applicant":           2,
				"amount":              -500,
			},
			http.StatusBadRequest,
		},
		{
			"Should fail for an invalid business",
			map[string]interface{}{
				"business":            1000,
				"accounting_provider": 1,
				"applicant":           1,
				"amount":              500,
			},
			http.StatusNotFound,
		},
		{
			"Should fail for an invalid accounting provider",
			map[string]interface{}{
				"business":            1,
				"accounting_provider": 1000,
				"applicant":           1,
				"amount":              500,
			},
			http.StatusNotFound,
		},
		{
			"Should fail for an invalid applicant",
			map[string]interface{}{
				"business":            1,
				"accounting_provider": 2,
				"applicant":           2,
				"amount":              500,
			},
			http.StatusNotFound,
		},
		{
			"Should succeed for a successful loan",
			map[string]interface{}{
				"business":            1,
				"accounting_provider": 2,
				"applicant":           1,
				"amount":              500,
			},
			http.StatusCreated,
		},
	}

	router := gin.Default()
	InitializeRouterGroup(router)

	for _, testCase := range testCases {
		t.Run(testCase.test_case, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			marshalledInput, _ := json.Marshal(testCase.input)
			req, _ := http.NewRequest("POST", "/loans", bytes.NewReader(marshalledInput))
			router.ServeHTTP(recorder, req)

			result := recorder.Result().Body
			responseBytes, _ := io.ReadAll(result)

			var actualResponse any
			json.Unmarshal(responseBytes, &actualResponse)

			assert.Equal(t, testCase.response_code, recorder.Code)
		})
	}

}
