package accounting_providers

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

func TestRetrieveProviders(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/accounting_providers", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse map[string]interface{}
	json.Unmarshal(responseBytes, &actualResponse)

	assert.IsType(t, []interface{}{}, actualResponse["providers"])
	assert.Equal(t, http.StatusOK, recorder.Code)
}
