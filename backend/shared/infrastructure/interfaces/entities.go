package shared_interfaces

import (
	provider_schemas "backend/demyst-technical-interview/domains/accounting_providers/schemas"
	business_schemas "backend/demyst-technical-interview/domains/businesses/schemas"
	user_schemas "backend/demyst-technical-interview/domains/users/schemas"
)

type Entities interface {
	*business_schemas.Business | *provider_schemas.AccountingProvider | *user_schemas.User
}

type EntityInterface[E Entities] interface {
	Entities
	Retrieve() E
}

func RetrieveEntity[E Entities, EI EntityInterface[E]](c EI) E {
	return c.Retrieve()
}
