const {
  helloCommand,
  lurkCommand,
  backCommand,
  fadedCommand,
  linksCommand,
  cratestatsCommand,
  areacodeCommand,
  scCommand,
  primeCommand,
  codeCommand,
  diceCommand,
  smortCommand,
  shoutOutCommand,
  listCommands,
  burntCommand,
  mixesCommand,
  vinylCommand,
} = require("../commands/commands");

const {
  rockCommand,
  paperCommand,
  scissorsCommand,
} = require("../commands/rps/rps");

const { eightballCommand } = require("../commands/8ball/eightBall");
const { quoteCommand } = require("../commands/quote/quote");
const { dadjokeCommand } = require("../commands/dadjoke/dadjoke");
const { factCommand } = require("../commands/fact/fact");
const { weatherCommand } = require("../commands/weather/weather");
const { testCommand } = require("../commands/test_command/test_command");
const { statsCommand } = require("../commands/stats/stats");
const { dypCommand } = require("../commands/stats/didYouPlay");
const { doublesCommand } = require("../commands/stats/doublesPlayed");
const { longestTrackCommand } = require("../commands/stats/longestTrack");
const { shortestTrackCommand } = require("../commands/stats/shortestTrack");
const { npCommands } = require("../commands/nowplaying/npcommands");

const { dypInfo, statsInfo, npInfo, lightsInfo } = require("../auto-commands/autoCommands")

const commandList = {
  test: testCommand,
  hello: helloCommand,
  lurk: lurkCommand,
  back: backCommand,
  faded: fadedCommand,
  links: linksCommand,
  so: shoutOutCommand, // mods & streamers only
  commands: listCommands,
  burnt: burntCommand,
  mixes: mixesCommand,
  vinyl: vinylCommand,
  cratestats: cratestatsCommand,
  714: areacodeCommand,
  sc: scCommand,
  prime: primeCommand,
  code: codeCommand,
  dice: diceCommand,
  smort: smortCommand,
  "8ball": eightballCommand,
  quote: quoteCommand,
  dadjoke: dadjokeCommand,
  fact: factCommand,
  rock: rockCommand,
  paper: paperCommand,
  scissors: scissorsCommand,
  weather: weatherCommand,  
  np: npCommands,
  stats: statsCommand,
  doubles: doublesCommand,
  longestsong: longestTrackCommand,
  shortestsong: shortestTrackCommand,
  dyp: dypCommand,  
  dypInfo: dypInfo,
  statsInfo: statsInfo,
  npInfo: npInfo,
  lightsInfo: lightsInfo,  
};

const urlCommandList = {
  np: npCommands,
  dyp: dypCommand,
  stats: statsCommand,
  doubles: doublesCommand,
  longestsong: longestTrackCommand,
  shortestsong: shortestTrackCommand,
};

module.exports = {
  commandList: commandList,
  urlCommandList: urlCommandList,  
};
