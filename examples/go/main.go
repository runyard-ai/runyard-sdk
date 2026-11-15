package main

import (
	"log"
	"net/http"
	"os"
	"time"

	runyard "github.com/runyard-ai/runyard-sdk/go"
	"github.com/runyard-ai/runyard-sdk/go/relay"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	// Stands in for your sign-in: everyone is this person of the workspace.
	person := env("RUNYARD_PERSON")

	// The relay is runyard's API, served by your backend to your front end.
	// It holds the key, and lets each person reach only their own sessions.
	agents, err := relay.New(relay.Config{
		URL: env("RUNYARD_URL"),
		Key: env("RUNYARD_KEY"), // sessions.read, sessions.write, sessions.person

		// Who is asking. Your own sign-in goes here: read your session cookie
		// and return the person's email.
		Person: func(*http.Request) (relay.Person, error) {
			return relay.Person{Email: person}, nil
		},

		// Which sessions they reach: their own, started from this app.
		Scope: func(_ *http.Request, p relay.Person) (relay.Scope, error) {
			return relay.Scope{Owner: p.Email, Labels: map[string]string{"app": "acme-chat"}}, nil
		},

		// What a session is started with, besides what the browser said.
		Start: func(_ *http.Request, _ relay.Person, spec *runyard.SessionSpec) error {
			if profile := os.Getenv("RUNYARD_PROFILE"); profile != "" {
				spec.ProfileId = &profile
			}
			return nil
		},
	})
	if err != nil {
		return err
	}

	mux := http.NewServeMux()
	mux.Handle("/agents/", http.StripPrefix("/agents", agents))
	mux.Handle("/", http.FileServer(http.Dir("../web/dist")))

	log.Print("Acme Chat on http://localhost:3000")
	server := &http.Server{Addr: ":3000", Handler: mux, ReadHeaderTimeout: 10 * time.Second}
	return server.ListenAndServe()
}

func env(name string) string {
	v := os.Getenv(name)
	if v == "" {
		log.Fatalf("%s is not set", name)
	}
	return v
}
