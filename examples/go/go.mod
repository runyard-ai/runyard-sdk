module acme-chat

go 1.26

require github.com/runyard-ai/runyard-sdk/go v0.61.2

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/oapi-codegen/runtime v1.7.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
)

// The SDK beside this example. Outside this repository, remove this line and
// run `go mod tidy`.
replace github.com/runyard-ai/runyard-sdk/go => ../../go
