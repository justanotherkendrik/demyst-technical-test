package cache_service

import (
	"context"
	"errors"
	"os"

	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

func InitializeClient() {
	redisClient = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("CACHE_URL"),
		Password: "",
		DB:       0,
	})
}

func RetrieveCache() *redis.Client {
	return redisClient
}

func StoreToHashMap(key string, value map[string]interface{}) error {
	if redisClient == nil {
		return errors.New("redis client is not initialized")
	}

	_, err := redisClient.HSet(context.Background(), key, value).Result()
	if err != nil {
		return err
	}

	return nil
}

func RetrieveFromHashMap(key string, inputStruct any) error {
	if redisClient == nil {
		return errors.New("redis client is not initialized")
	}

	err := redisClient.HGetAll(context.Background(), key).Scan(inputStruct)
	if err != nil {
		return err
	}

	return nil
}
