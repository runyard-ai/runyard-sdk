import express from 'express';
import { createRelay, toNodeHandler } from '@runyard-ai/runyard-sdk/relay';

const env = (name) => process.env[name] ?? (console.error(`${name} is not set`), process.exit(1));

// Stands in for your sign-in: everyone is this person of the workspace.
const person = env('RUNYARD_PERSON');

// The relay is runyard's API, served by your backend to your front end. It
// holds the key, and lets each person reach only their own sessions.
const relay = createRelay({
  url: env('RUNYARD_URL'),
  key: env('RUNYARD_KEY'), // sessions.read, sessions.write, sessions.person
  prefix: '/agents',

  // Who is asking. Your own sign-in goes here: read your session cookie and
  // return the person's email.
  person: (_req) => ({ email: person }),

  // Which sessions they reach: their own, started from this app.
  scope: (_req, p) => ({ owner: p.email, labels: { app: 'acme-chat' } }),

  // What a session is started with, besides what the browser said.
  start: (_req, _p, spec) => {
    if (process.env.RUNYARD_PROFILE) spec.profileId = process.env.RUNYARD_PROFILE;
  },
});

const app = express();
app.use('/agents', toNodeHandler(relay));
app.use(express.static('../web/dist'));

app.listen(3000, () => console.log('Acme Chat on http://localhost:3000'));
