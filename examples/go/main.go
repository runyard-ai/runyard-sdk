package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/runyard-ai/runyard-sdk/go/ry"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	// Your application's key: it stays here, on your backend, and never
	// reaches a browser. sessions.read and sessions.write.
	url := strings.TrimRight(env("RUNYARD_URL"), "/")
	c, err := ry.New(url, env("RUNYARD_KEY"))
	if err != nil {
		return err
	}

	// Stands in for your sign-in: everyone is this user of yours. Their id
	// is your own — a row of your users table — and runyard keeps it as it
	// is.
	userID := env("RUNYARD_USER")

	mux := http.NewServeMux()
	// The page asks for its chat, and is given a token for it: with it, the
	// browser talks to runyard directly, in that one session and nothing
	// else.
	mux.HandleFunc("POST /chat", func(w http.ResponseWriter, r *http.Request) {
		user := &ry.EndUser{ID: userID} // Your sign-in goes here: who is asking.
		chat, err := chatOf(r.Context(), c, user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		tok, err := chat.Token(r.Context(), ry.TokenOptions{EndUser: user})
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"sessionId": chat.ID(), "token": tok.Value, "expiresAt": tok.ExpiresAt, "apiBase": url + "/v1",
		})
	})
	mux.Handle("/", http.FileServer(http.Dir("../web/dist")))

	log.Print("Acme Chat on http://localhost:3000")
	server := &http.Server{Addr: ":3000", Handler: mux, ReadHeaderTimeout: 10 * time.Second}
	return server.ListenAndServe()
}

// chatOf is the signed-in user's chat: the one they have, or a new one, for
// them.
func chatOf(ctx context.Context, c *ry.Client, user *ry.EndUser) (*ry.Session, error) {
	mine, err := c.Sessions(ctx, ry.List{EndUser: user.ID})
	if err != nil {
		return nil, err
	}
	if len(mine) > 0 {
		return c.Session(mine[0].ID), nil
	}
	return c.Start(ctx, ry.Start{Profile: os.Getenv("RUNYARD_PROFILE"), Title: "Acme Chat", EndUser: user})
}

func env(name string) string {
	v := os.Getenv(name)
	if v == "" {
		log.Fatalf("%s is not set", name)
	}
	return v
}
