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
} = require('../commands/commands')

const {
  rockCommand,
  paperCommand,
  scissorsCommand
} = require('../commands/rps/rps')

const { eightballCommand } = require('../commands/8ball/eightBall')
const { quoteCommand } = require('../commands/quote')
const { dadjokeCommand } = require('../commands/dadjoke')
const { factCommand } = require('../commands/fact')
const { weatherCommand } = require('../commands/weather')
const { testCommand } = require('../commands/test_command')
const { statsCommand } = require('../commands/stats/stats')
const { npCommands, dypCommand } = require('../commands/nowplaying/npcommands')

const commandList = {
  hello: helloCommand,
  lurk: lurkCommand,
  back: backCommand,
  faded: fadedCommand,
  links: linksCommand,
  cratestats: cratestatsCommand,
  '714': areacodeCommand,
  sc: scCommand,
  prime: primeCommand,
  code: codeCommand,
  dice: diceCommand,
  smort: smortCommand,
  '8ball': eightballCommand,
  quote: quoteCommand,
  dadjoke: dadjokeCommand,
  fact: factCommand,
  rock: rockCommand,
  paper: paperCommand,
  scissors: scissorsCommand,
  weather: weatherCommand,
  test: testCommand,
  np: npCommands,
  dyp: dypCommand,
  stats: statsCommand
}

module.exports = commandList
