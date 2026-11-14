// Command contract writes the API's document as the SDKs are generated from
// it: without the operations marked x-sdk-excluded, and without what only
// they used.
//
//	go run ./internal/contract ../../openapi/agents.yaml agents.yaml
//
// The operations left out are those no program with a key can call through a
// generated client: the console's own routes, a browser's redirects, a
// WebSocket. The server, its UIs and its reference keep them; the SDK's
// published openapi/agents.yaml is the whole document.
//
// The document is rewritten as yaml.v3's nodes, never as values, so what is
// kept is kept as it was written: its order, and each scalar's spelling.
package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

// excluded is the field that leaves an operation out, with why.
const excluded = "x-sdk-excluded"

// methods are a path item's operations; anything else in one (parameters,
// servers, a summary) is the item's own.
var methods = map[string]bool{
	"get": true, "put": true, "post": true, "delete": true,
	"options": true, "head": true, "patch": true, "trace": true,
}

func main() { os.Exit(run(os.Args[1:], os.Stderr)) }

// run is the command, and its exit status.
func run(args []string, stderr io.Writer) int {
	if err := write(args); err != nil {
		_, _ = fmt.Fprintln(stderr, "contract:", err)
		return 1
	}
	return 0
}

func write(args []string) error {
	if len(args) != 2 {
		return errors.New("usage: contract <agents.yaml> <the SDKs' agents.yaml>")
	}
	src, err := os.ReadFile(args[0]) //nolint:gosec // the document make generate names, as anybody running it does
	if err != nil {
		return err
	}
	out, err := filter(src)
	if err != nil {
		return err
	}
	return os.WriteFile(args[1], out, 0o644) //nolint:gosec // a document, read by anybody
}

// filter is src without the operations marked excluded, the paths left with
// none, and the components nothing kept refers to.
func filter(src []byte) ([]byte, error) {
	var doc yaml.Node
	if err := yaml.Unmarshal(src, &doc); err != nil {
		return nil, err
	}
	if doc.Kind != yaml.DocumentNode || len(doc.Content) != 1 || doc.Content[0].Kind != yaml.MappingNode {
		return nil, errors.New("not an OpenAPI document: not a mapping")
	}
	root := doc.Content[0]
	paths := value(root, "paths")
	if paths == nil || paths.Kind != yaml.MappingNode {
		return nil, errors.New("not an OpenAPI document: no paths")
	}
	for i := 0; i < len(paths.Content); i += 2 {
		item := paths.Content[i+1]
		if item.Kind != yaml.MappingNode {
			return nil, fmt.Errorf("the path %s is not a mapping", paths.Content[i].Value)
		}
		if err := dropExcluded(paths.Content[i].Value, item); err != nil {
			return nil, err
		}
		if !hasOperation(item) {
			paths.Content = append(paths.Content[:i], paths.Content[i+2:]...)
			i -= 2
		}
	}
	prune(root)
	pruneTags(root, paths)

	var b bytes.Buffer
	enc := yaml.NewEncoder(&b)
	enc.SetIndent(2)
	if err := enc.Encode(&doc); err != nil {
		return nil, err
	}
	if err := enc.Close(); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

// dropExcluded takes the path item's operations marked excluded out of it.
// A mark is a reason: one that says nothing is refused, so that what is left
// out is never left out by an accident of editing.
func dropExcluded(path string, item *yaml.Node) error {
	for i := 0; i < len(item.Content); i += 2 {
		method := item.Content[i].Value
		if !methods[method] {
			continue
		}
		why := value(item.Content[i+1], excluded)
		if why == nil {
			continue
		}
		if why.Kind != yaml.ScalarNode || strings.TrimSpace(why.Value) == "" {
			return fmt.Errorf("%s %s: %s says no reason", strings.ToUpper(method), path, excluded)
		}
		item.Content = append(item.Content[:i], item.Content[i+2:]...)
		i -= 2
	}
	return nil
}

func hasOperation(item *yaml.Node) bool {
	for i := 0; i < len(item.Content); i += 2 {
		if methods[item.Content[i].Value] {
			return true
		}
	}
	return false
}

// prune takes out of components what nothing kept refers to, however
// indirectly: a $ref, or a discriminator's mapping, which names a schema by
// the same "#/components/…" string. Security schemes are named by key, not by
// reference, and are all kept.
func prune(root *yaml.Node) {
	components := value(root, "components")
	if components == nil || components.Kind != yaml.MappingNode {
		return
	}
	reached := map[string]bool{}
	var queue []*yaml.Node
	mark := func(n *yaml.Node) {
		refs(n, func(ref string) {
			if reached[ref] {
				return
			}
			reached[ref] = true
			if target := resolve(components, ref); target != nil {
				queue = append(queue, target)
			}
		})
	}
	for i := 0; i < len(root.Content); i += 2 {
		if root.Content[i].Value != "components" {
			mark(root.Content[i+1])
		}
	}
	for len(queue) > 0 {
		next := queue[0]
		queue = queue[1:]
		mark(next)
	}
	for i := 0; i < len(components.Content); i += 2 {
		kind, entries := components.Content[i].Value, components.Content[i+1]
		if kind == "securitySchemes" || entries.Kind != yaml.MappingNode {
			continue
		}
		for j := 0; j < len(entries.Content); j += 2 {
			if !reached["#/components/"+kind+"/"+entries.Content[j].Value] {
				entries.Content = append(entries.Content[:j], entries.Content[j+2:]...)
				j -= 2
			}
		}
	}
}

// pruneTags takes out of the document's tags those no operation kept has.
func pruneTags(root, paths *yaml.Node) {
	tags := value(root, "tags")
	if tags == nil || tags.Kind != yaml.SequenceNode {
		return
	}
	used := map[string]bool{}
	for i := 1; i < len(paths.Content); i += 2 {
		item := paths.Content[i]
		for j := 0; j < len(item.Content); j += 2 {
			if !methods[item.Content[j].Value] {
				continue
			}
			if named := value(item.Content[j+1], "tags"); named != nil {
				for _, t := range named.Content {
					used[t.Value] = true
				}
			}
		}
	}
	kept := tags.Content[:0]
	for _, t := range tags.Content {
		if name := value(t, "name"); name != nil && used[name.Value] {
			kept = append(kept, t)
		}
	}
	tags.Content = kept
}

// refs calls found with every "#/components/…" string under n.
func refs(n *yaml.Node, found func(string)) {
	if n.Kind == yaml.ScalarNode && strings.HasPrefix(n.Value, "#/components/") {
		found(n.Value)
	}
	for _, c := range n.Content {
		refs(c, found)
	}
}

// resolve is the component ref names, or nil when there is none.
func resolve(components *yaml.Node, ref string) *yaml.Node {
	parts := strings.Split(strings.TrimPrefix(ref, "#/components/"), "/")
	if len(parts) != 2 {
		return nil
	}
	entries := value(components, parts[0])
	if entries == nil {
		return nil
	}
	return value(entries, parts[1])
}

// value is the value of key in the mapping m, or nil.
func value(m *yaml.Node, key string) *yaml.Node {
	if m.Kind != yaml.MappingNode {
		return nil
	}
	for i := 0; i+1 < len(m.Content); i += 2 {
		if m.Content[i].Value == key {
			return m.Content[i+1]
		}
	}
	return nil
}
