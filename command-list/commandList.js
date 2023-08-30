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
} = require('../commands/commands')

const {
	rockCommand,
	paperCommand,
	scissorsCommand,
} = require('../commands/rps/rps')

const { eightballCommand } = require('../commands/8ball/eightBall')
const { quoteCommand } = require('../commands/quote/quote')
const { dadjokeCommand } = require('../commands/dadjoke/dadjoke')
const { factCommand } = require('../commands/fact/fact')
const { weatherCommand } = require('../commands/weather/weather')
const { testCommand } = require('../commands/test_command/test_command')
const { myCommand } = require('../commands/my/mycommand')
const { lightsInfo } = require('../auto-commands/autoCommands')
const { lottoCommand } = require('../commands/lotto/lotto')

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
	'8ball': eightballCommand,
	quote: quoteCommand,
	dadjoke: dadjokeCommand,
	fact: factCommand,
	rock: rockCommand,
	paper: paperCommand,
	scissors: scissorsCommand,
	weather: weatherCommand,
	lightsInfo: lightsInfo,
	my: myCommand,
	lotto: lottoCommand,
}

module.exports = {
	commandList: commandList,
}
