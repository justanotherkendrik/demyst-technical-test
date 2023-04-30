package user_queries

import (
	"backend/demyst-technical-interview/domains/users/schemas"
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func RetrieveUserDetailsById(id int) (*schemas.User, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM users WHERE id = $1"

	var user schemas.User
	err := db.QueryRow(context.Background(), query, id).Scan(&user.ID, &user.Email, &user.DisplayName)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func RetrieveUserDetailsByEmail(email string) (*schemas.User, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM users WHERE email = $1"

	var user schemas.User
	err := db.QueryRow(context.Background(), query, email).Scan(&user.ID, &user.Email, &user.DisplayName)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
