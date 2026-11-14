#!/bin/sh
# Installs, builds and tests the TypeScript SDK, and holds it to a server when
# RUNYARD_AGENTS_URL names one (runyard-agents' test/sdk always does):
#
#   sh check.sh
#   RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_KEY=… sh check.sh
#
# An install that prints `npm warn` fails, as it does everywhere in
# runyard-agents: a warning is an error, fixed and never filtered.
set -eu
cd "$(dirname "$0")"

# The lock's packages, and none of their scripts: the build is the next step's.
if ! out=$(npm ci --no-audit --no-fund --ignore-scripts 2>&1); then
	printf '%s\n' "$out" >&2
	exit 1
fi
printf '%s\n' "$out"
if printf '%s\n' "$out" | grep -qi '^npm warn'; then
	echo "check.sh: npm warned — a warning is an error: fix it, do not silence it" >&2
	exit 1
fi

node_modules/.bin/tsc -p tsconfig.json
node_modules/.bin/tsc -p tsconfig.test.json
node --test --test-reporter=spec --test-timeout=60000 build/test/errors.test.js build/test/streams.test.js
if [ -n "${RUNYARD_AGENTS_URL:-}" ]; then
	node --test --test-reporter=spec --test-timeout=300000 build/test/conformance.test.js
fi
