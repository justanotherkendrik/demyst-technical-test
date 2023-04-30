package businesses

import (
	tests_service "backend/demyst-technical-interview/shared/infrastructure/tests"
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

func TestRetrieveBalanceSheetWithoutParam(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/businesses//balances", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, map[string]interface{}{"error": "Invalid business ID provided."}, actualResponse)
	assert.Equal(t, http.StatusBadRequest, recorder.Code)
}

func TestRetrieveUserDetailsWithInvalidBusinessID(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/businesses/invalidBusinessId/balances", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, map[string]interface{}{"error": "Invalid business ID provided."}, actualResponse)
	assert.Equal(t, http.StatusBadRequest, recorder.Code)
}

func TestRetrieveUserDetailsWithUnknownBusiness(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/businesses/10/balances", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, map[string]interface{}{"error": "Business could not be found."}, actualResponse)
	assert.Equal(t, http.StatusNotFound, recorder.Code)
}

func TestRetrieveUserDetailsWithValidBusiness(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/businesses/1/balances", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse map[string]any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, float64(1), actualResponse["business"].(map[string]interface{})["id"])
	assert.IsType(t, []interface{}{}, actualResponse["balance_sheet"])
	assert.Equal(t, http.StatusOK, recorder.Code)
}

func TestRetrieveBusinesses(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/businesses", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse map[string]interface{}
	json.Unmarshal(responseBytes, &actualResponse)

	assert.IsType(t, []interface{}{}, actualResponse["businesses"])
	assert.Equal(t, http.StatusOK, recorder.Code)
}
