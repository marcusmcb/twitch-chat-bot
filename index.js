const tmi = require('tmi.js');
const dotenv = require('dotenv')

dotenv.config()

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'djmarcusmcb',
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: ['djmarcusmcb']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  if(message.toLowerCase() === '!hello') {
    client.say(channel, `@${tags.username}, Yo what's up`);
  }
});