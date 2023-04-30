package logger_service

import (
	"fmt"
	"log"
	"os"
	"strings"
)

var logger *log.Logger

func createLogMessage(logLevel, message string) string {
	return fmt.Sprintf("[%s]: %s", strings.ToUpper(logLevel), message)
}

func logMessage(logLevel, message string) {
	env := os.Getenv("APP_ENV")
	if env != "test" {
		logEntry := createLogMessage(logLevel, message)
		if strings.ToLower(logLevel) == "fatal" {
			logger.Panicln(logEntry)
			return
		}
		logger.Println(logEntry)
	}
}

func InitializeLogger() {
	logger = log.Default() // Note that this may change across environments. For simplicity, we will just use the default logger.
}

func LogWarning(message string) {
	logMessage("warn", message)
}

func LogNonFatalError(message string) {
	logMessage("error", message)
}

func LogFatalError(message string) {
	logMessage("fatal", message)
}
