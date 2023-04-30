package schemas

type User struct {
	ID          int    `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
}

func (schema *User) Retrieve() *User {
	return schema
}
