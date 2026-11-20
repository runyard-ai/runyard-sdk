import express from 'express';
import { Runyard } from '@runyard-ai/runyard-sdk/ry';

const env = (name) => process.env[name] ?? (console.error(`${name} is not set`), process.exit(1));

// Your application's key: it stays here, on your backend, and never reaches
// a browser. sessions.read and sessions.write.
const url = env('RUNYARD_URL').replace(/\/+$/, '');
const ry = new Runyard({ url, key: env('RUNYARD_KEY') });

// Stands in for your sign-in: everyone is this user of yours. Their id is
// your own — a row of your users table — and runyard keeps it as it is.
const userId = env('RUNYARD_USER');

// The signed-in user's chat: the one they have, or a new one, for them.
async function chatOf(user) {
  const [mine] = await ry.sessions({ endUser: user.id });
  if (mine) return ry.session(mine.id);
  return ry.start({ profile: process.env.RUNYARD_PROFILE, title: 'Acme Chat', endUser: user });
}

const app = express();

// The page asks for its chat, and is given a token for it: with it, the
// browser talks to runyard directly, in that one session and nothing else.
app.post('/chat', async (_req, res, next) => {
  try {
    const user = { id: userId }; // Your sign-in goes here: who is asking.
    const chat = await chatOf(user);
    const { token, expiresAt } = await chat.token({ endUser: user });
    res.json({ sessionId: chat.id, token, expiresAt, apiBase: `${url}/v1` });
  } catch (err) {
    next(err);
  }
});
app.use(express.static('../web/dist'));

app.listen(3000, () => console.log('Acme Chat on http://localhost:3000'));
