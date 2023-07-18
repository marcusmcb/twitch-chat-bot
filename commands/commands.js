const dotenv = require("dotenv");
dotenv.config();

const listCommands = (channel, tags, args, client) => {
  client.say(
    channel,
    "You can check out this channel's chat command list here: marcusmcb.github.io/twitch-chat-commands"
  );
};

const shoutOutCommand = (channel, tags, args, client, obs) => {
  let argsParsed = args[0].slice(1);
  if (tags.username === `${process.env.TWITCH_CHANNEL_NAME}` || tags.mod) {
    client.say(
      channel,
      `Be sure to follow ${args}'s channel here on Twitch: www.twitch.tv/${argsParsed} `
    );
  }
};

const helloCommand = (channel, tags, args, client, obs) => {
  client.say(
    channel,
    `@${process.env.TWITCH_CHANNEL_NAME}, what's good homie! 👋👋👋`
  );
};

const lurkCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    `@${tags.username} is gonna be over there, doin' whatever...`
  );
};

const backCommand = (channel, tags, args, client) => {
  client.say(channel, `Lurk no more... @${tags.username} has returned!`);
};

const fadedCommand = (channel, tags, args, client) => {
  const fadedResult = Math.floor(Math.random() * 100) + 1;
  client.say(channel, `@${tags.username} is ${fadedResult}% faded right now.`);
};

const smortCommand = (channel, tags, args, client) => {
  let smortValue = Math.floor(Math.random() * 101);
  client.say(channel, `@${tags.username} is ${smortValue}% SMORT!`);
};

const burntCommand = (channel, tags, args, client) => {
  let burntValue = Math.floor(Math.random() * 101);
  client.say(channel, `@${tags.username} is ${burntValue}% burnt right now!`);
};

const linksCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    `You can find all of my socials & links @ http://www.djmarcusmcbride.com`
  );
};

const vinylCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    `Wanna dig through my record collection?  You can check out some of my favorite remixes and throwbacks over on TikTok @ www.tiktok.com/@djmarcusmcb`
  );
};

const cratestatsCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    "DJs - Want to learn more about what you actually did during your last set?  Check out www.cratestats.com to learn more about data analytics for DJs (and beta testing if you're up for it!)"
  );
};

const areacodeCommand = (channel, tags, args, client) => {
  const channelName = channel.slice(1).split("#");
  client.say(
    channel,
    `${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`
  );
};

const scCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    `You can check out MarcusMCB's Soundcloud page over @ soundcloud.com/marcusmcbride.`
  );
};

const mixesCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    `You can check out my mixes on MixCloud over @ www.mixcloud.com/marcusmcbride`
  );
};

const primeCommand = (channel, tags, args, client) => {
  const channelName = channel.slice(1).split("#");
  client.say(
    channel,
    `Got Amazon Prime? If you do, you can use your free Prime subscription to support my channel for free! subs.twitch.tv/${channelName}`
  );
};

const codeCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    "You can find streaming tools for Twitch, Discord, Twitter, plus a lot of other fun tech stuff over on my Github page! github.com/marcusmcb"
  );
};

const diceCommand = (channel, tags, args, client) => {
  const result = Math.floor(Math.random() * 6) + 1;
  client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`);
};

module.exports = {
  helloCommand: helloCommand,
  lurkCommand: lurkCommand,
  backCommand: backCommand,
  fadedCommand: fadedCommand,
  linksCommand: linksCommand,
  cratestatsCommand: cratestatsCommand,
  areacodeCommand: areacodeCommand,
  scCommand: scCommand,
  primeCommand: primeCommand,
  codeCommand: codeCommand,
  diceCommand: diceCommand,
  smortCommand: smortCommand,
  shoutOutCommand: shoutOutCommand,
  listCommands: listCommands,
  burntCommand: burntCommand,
  mixesCommand: mixesCommand,
  vinylCommand: vinylCommand
};
