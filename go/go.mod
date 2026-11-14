// The Go SDK for runyard-agents: the client generated from the API's OpenAPI
// document (openapi/agents.yaml), and what reading its streams takes.
//
// It is developed inside runyard-agents, beside the server it talks to, and
// published to github.com/runyard-ai/runyard-sdk, under go/, with each
// release: the same version, so SDK v0.36.0 is the client of server v0.36.0.
// It requires nothing of the server's.
module github.com/runyard-ai/runyard-sdk/go

go 1.26

require (
	github.com/oapi-codegen/runtime v1.7.0
	go.uber.org/goleak v1.3.0
	gopkg.in/yaml.v2 v2.4.0
	gopkg.in/yaml.v3 v3.0.1
)

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/kr/text v0.2.0 // indirect
)
