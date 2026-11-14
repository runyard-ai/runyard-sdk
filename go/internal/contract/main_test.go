package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"go.uber.org/goleak"
)

func TestMain(m *testing.M) { goleak.VerifyTestMain(m) }

const document = `openapi: 3.0.3
info: {title: t, version: "1"}
tags:
  - name: Kept
  - name: Gone
  - name: Unused
security:
  - key: []
paths:
  /things:
    parameters:
      - $ref: "#/components/parameters/Shared"
    get:
      operationId: listThings
      tags: [Kept]
      responses:
        "200":
          content:
            application/json:
              schema: {$ref: "#/components/schemas/Things"}
    post:
      operationId: watchThings
      tags: [Gone]
      x-sdk-excluded: "A WebSocket."
      responses:
        "101": {description: switched}
  /console:
    parameters:
      - $ref: "#/components/parameters/ConsoleOnly"
    get:
      operationId: consoleThing
      tags: [Gone]
      x-sdk-excluded: "The console's own."
      responses:
        "200":
          content:
            application/json:
              schema: {$ref: "#/components/schemas/ConsoleThing"}
components:
  securitySchemes:
    key: {type: http, scheme: bearer}
    unused: {type: http, scheme: bearer}
  parameters:
    Shared: {name: x, in: query, schema: {type: string}}
    ConsoleOnly: {name: y, in: query, schema: {type: string}}
  schemas:
    Things:
      type: array
      items: {$ref: "#/components/schemas/Thing"}
    Thing:
      oneOf:
        - $ref: "#/components/schemas/Round"
      discriminator:
        propertyName: kind
        mapping:
          round: "#/components/schemas/Round"
          square: "#/components/schemas/Square"
    Round:
      type: object
      properties:
        kind: {type: string, enum: [on, off]}
        next: {$ref: "#/components/schemas/Thing"}
    Square: {type: object}
    ConsoleThing:
      type: object
      properties:
        part: {$ref: "#/components/schemas/ConsolePart"}
    ConsolePart: {type: object}
    Orphan: {type: object}
`

func TestFilter(t *testing.T) {
	out, err := filter([]byte(document))
	if err != nil {
		t.Fatal(err)
	}
	got := string(out)
	for _, gone := range []string{
		"watchThings", "consoleThing", "/console:", "x-sdk-excluded",
		"ConsoleThing", "ConsolePart", "ConsoleOnly", "Orphan", "name: Gone", "name: Unused",
	} {
		if strings.Contains(got, gone) {
			t.Errorf("%s is still there:\n%s", gone, got)
		}
	}
	// What is kept is what a kept operation reaches, however: a path's own
	// parameters, a $ref of a $ref, a cycle, a discriminator's mapping — and
	// every security scheme, which is named rather than referred to.
	for _, kept := range []string{
		"listThings", "/things:", "Shared:", "Things:", "Thing:", "Round:", "Square:",
		"key: {type: http, scheme: bearer}", "unused: {type: http, scheme: bearer}", "name: Kept",
	} {
		if !strings.Contains(got, kept) {
			t.Errorf("%s is gone:\n%s", kept, got)
		}
	}
	// As it was written: its order, each scalar's spelling, its quotes.
	if !strings.Contains(got, "enum: [on, off]") || !strings.Contains(got, `"200":`) {
		t.Errorf("a scalar was rewritten:\n%s", got)
	}
	if strings.Index(got, "Things:") > strings.Index(got, "Round:") || strings.Index(got, "openapi:") != 0 {
		t.Errorf("the order was changed:\n%s", got)
	}

	// The same document, the same bytes; and filtered again, nothing changes.
	again, err := filter([]byte(document))
	if err != nil || !bytes.Equal(again, out) {
		t.Errorf("not the same twice: %v", err)
	}
	twice, err := filter(out)
	if err != nil || !bytes.Equal(twice, out) {
		t.Errorf("filtered again it changed: %v\n%s", err, twice)
	}
}

func TestADocumentWithLittleInIt(t *testing.T) {
	// No components, no tags, a ref to nothing and one of no shape it knows:
	// nothing to prune, and nothing fails.
	src := `openapi: 3.0.3
paths:
  /a:
    get:
      operationId: a
      responses:
        "200":
          content:
            application/json:
              schema:
                allOf:
                  - $ref: "#/components/schemas/Missing"
                  - $ref: "#/components/schemas"
`
	out, err := filter([]byte(src))
	if err != nil || !strings.Contains(string(out), "operationId: a") {
		t.Fatalf("%v\n%s", err, out)
	}
	for _, src := range []string{
		src + "components: [1]\ntags: {a: b}\n",
		src + "components:\n  schemas: [1]\n",
		src + "tags:\n  - description: no name\n",
	} {
		if _, err := filter([]byte(src)); err != nil {
			t.Errorf("%v\n%s", err, src)
		}
	}
}

func TestWhatIsNotADocumentItCanFilter(t *testing.T) {
	for name, src := range map[string]string{
		"not YAML":          "a: [",
		"empty":             "",
		"a sequence":        "- a\n",
		"no paths":          "openapi: 3.0.3\n",
		"paths of nothing":  "paths: [a]\n",
		"a path of nothing": "paths:\n  /a: [get]\n",
		"no reason":         "paths:\n  /a:\n    get:\n      x-sdk-excluded: \"  \"\n",
		"a reason of parts": "paths:\n  /a:\n    get:\n      x-sdk-excluded: {why: x}\n",
	} {
		if out, err := filter([]byte(src)); err == nil {
			t.Errorf("%s: %s", name, out)
		}
	}
}

func TestRun(t *testing.T) {
	dir := t.TempDir()
	in, out := filepath.Join(dir, "agents.yaml"), filepath.Join(dir, "sdk.yaml")
	if err := os.WriteFile(in, []byte(document), 0o600); err != nil {
		t.Fatal(err)
	}
	var stderr bytes.Buffer
	if status := run([]string{in, out}, &stderr); status != 0 || stderr.Len() != 0 {
		t.Fatalf("%d %s", status, &stderr)
	}
	if written, err := os.ReadFile(out); err != nil || !bytes.Contains(written, []byte("listThings")) || bytes.Contains(written, []byte("watchThings")) {
		t.Fatalf("%s %v", written, err)
	}

	bad := filepath.Join(dir, "bad.yaml")
	if err := os.WriteFile(bad, []byte("- a\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	for name, args := range map[string][]string{
		"no arguments":     nil,
		"one":              {in},
		"three":            {in, out, out},
		"no such file":     {filepath.Join(dir, "missing.yaml"), out},
		"not a document":   {bad, out},
		"nowhere to write": {in, filepath.Join(dir, "no", "such", "dir", "x.yaml")},
	} {
		stderr.Reset()
		if status := run(args, &stderr); status != 1 || !strings.HasPrefix(stderr.String(), "contract: ") {
			t.Errorf("%s: %d %q", name, status, &stderr)
		}
	}
}
