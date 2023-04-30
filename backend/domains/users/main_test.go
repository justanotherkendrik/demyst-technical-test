package users

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

func TestRetrieveUserDetailsWithoutQuery(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, map[string]interface{}{"error": "User identity was not provided."}, actualResponse)
	assert.Equal(t, http.StatusBadRequest, recorder.Code)
}

func TestRetrieveUserDetailsWithUnknownUser(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users?email=unknown_user@email.com", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse any
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, map[string]interface{}{"error": "User could not be found."}, actualResponse)
	assert.Equal(t, http.StatusNotFound, recorder.Code)
}

func TestRetrieveUserDetailsWithEmail(t *testing.T) {
	router := gin.Default()
	InitializeRouterGroup(router)

	recorder := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users?email=test_user@email.com", nil)
	router.ServeHTTP(recorder, req)

	result := recorder.Result().Body
	responseBytes, _ := io.ReadAll(result)

	var actualResponse map[string]interface{}
	json.Unmarshal(responseBytes, &actualResponse)

	assert.Equal(t, float64(1), actualResponse["id"])
	assert.Equal(t, "test_user@email.com", actualResponse["email"])
	assert.Equal(t, "Test User", actualResponse["display_name"])
	assert.Equal(t, http.StatusOK, recorder.Code)
}
