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
	hugCommand,
	floatyCommand,
	postCommand,
	noMicCommand,
	gsdCommand,
	turntCommand,
	cakeCommand,
	raidCommand,
	bitsCommand,
	stuffedCommand,
	ericCommand,
	guttercheckCommand,
	cansCommand,
	knowsCommand,
	discordCommand,
	litCommand,
	highCommand,
	borkedCommand,
	respekCommand,
	npChatbotLinkCommand,
	yyCommand,
	greerCityCommand,
	portCommand,
	tonightCommand,
	skidaddleCommand,
	beefcakeCommand,
	portexCommand,
	playlistsCommand,
	dingusCommand,
	dangerCommand,
	brainrotCommand,
	warningCommand,
	pluribusCommand,
} = require('../commands/commands')

const {
	rockCommand,
	paperCommand,
	scissorsCommand,
} = require('../commands/rps/rps')

const {
	sceneChangeCommand,
} = require('../commands/sceneChangeCommand/sceneChangeCommand')
const {
	popupChangeCommand,
} = require('../commands/popupChangeCommand/popupChangeCommand')

const { eightballCommand } = require('../commands/8ball/eightBall')
const { quoteCommand } = require('../commands/quote/quote')
const { dadjokeCommand } = require('../commands/dadjoke/dadjoke')
const { factCommand } = require('../commands/fact/fact')
const { weatherCommand } = require('../commands/weather/weather')
const { fortuneCommand } = require('../commands/fortune/fortune')

const {
	lightsInfo,
	npChatbotInfo,
	discordInfo,
	generalCommandInfo,
} = require('../auto-commands/autoCommands')
const { testCommand } = require('../commands/test_command/test_command')

const { myCommand } = require('../commands/my/mycommand')
const { lottoCommand } = require('../commands/lotto/lotto')
const { birdcamCommand } = require('../commands/birdcam/birdcam')
const { uCommand } = require('../commands/urban_dictionary/urbanDictionary')
const { blackjackCommand } = require('../commands/blackjack/blackjack')
const { yeQuoteCommand } = require('../commands/yeQuote/yeQuote')
const { nutsCommand } = require('../commands/nuts/nuts')
const { askGPTCommand } = require('../commands/chatgpt/askgpt')
const { countdownCommand } = require('../commands/countdown/countdown')
const { highLowCommand } = require('../commands/highlow/highLow')
const { cultureCommand } = require('../commands/djculture/djCulture')
// const { maltCommand, lineupCommand } = require('../commands/malt/malt')

const commandList = {
	714: areacodeCommand,
	'8ball': eightballCommand,
	8613: pluribusCommand,
	askgpt: askGPTCommand,
	back: backCommand,
	beefcake: beefcakeCommand,
	birdcam: birdcamCommand,
	bits: bitsCommand, // mods & streamers only
	blackjack: blackjackCommand,
	borked: borkedCommand,
	brainrot: brainrotCommand,
	burnt: burntCommand,
	cake: cakeCommand,
	cans: cansCommand,
	code: codeCommand,
	commands: listCommands,
	countdown: countdownCommand,
	cratestats: cratestatsCommand,
	culture: cultureCommand,
	dadjoke: dadjokeCommand,
	danger: dangerCommand,
	dice: diceCommand,
	discord: discordCommand,
	discordInfo: discordInfo,
	dingus: dingusCommand,
	eric: ericCommand,
	faded: fadedCommand,
	fact: factCommand,
	floaty: floatyCommand,
	fortune: fortuneCommand,
	generalCommandInfo: generalCommandInfo,
	greercity: greerCityCommand,
	gsd: gsdCommand,
	guttercheck: guttercheckCommand,
	hello: helloCommand,
	high: highCommand,
	highlow: highLowCommand,
	hug: hugCommand,
	knows: knowsCommand,
	links: linksCommand,
	lit: litCommand,
	lightsInfo: lightsInfo,
	lotto: lottoCommand,
	lurk: lurkCommand,
	mixes: mixesCommand,
	my: myCommand,
	nomic: noMicCommand,
	npChatbotInfo: npChatbotInfo,
	npchatbot: npChatbotLinkCommand,
	nuts: nutsCommand,
	paper: paperCommand,
	playlists: playlistsCommand,
	port: portCommand,
	portex: portexCommand,
	post: postCommand,
	prime: primeCommand,
	quote: quoteCommand,
	raid: raidCommand,
	respek: respekCommand,
	rock: rockCommand,
	sc: scCommand,
	scissors: scissorsCommand,
	skidaddle: skidaddleCommand,
	smort: smortCommand,
	so: shoutOutCommand, // mods & streamers only
	stuffed: stuffedCommand,
	test: testCommand,
	tonight: tonightCommand,
	turnt: turntCommand,
	u: uCommand,
	vinyl: vinylCommand,
	warning: warningCommand,
	weather: weatherCommand,
	ye: yeQuoteCommand,
	yy: yyCommand,
	// malt: maltCommand,
	// lineup: lineupCommand,
}

const sceneChangeCommandList = {
	stuck: sceneChangeCommand,
	jeep: sceneChangeCommand,
	cruise: sceneChangeCommand,
}

const popupChangeCommandList = {
	birb: popupChangeCommand,
	hey: popupChangeCommand,
	turk: popupChangeCommand,
	naplife: popupChangeCommand,
	wellplayed: popupChangeCommand,
	yay: popupChangeCommand,
	noted: popupChangeCommand,
	dotell: popupChangeCommand,
	hangon: popupChangeCommand,
	golfclap: popupChangeCommand,
	sweaty: popupChangeCommand,
	high5: popupChangeCommand,
	highfive: popupChangeCommand,
	what: popupChangeCommand,
	eww: popupChangeCommand,
	rave: popupChangeCommand,
}

module.exports = {
	commandList: commandList,
	sceneChangeCommandList: sceneChangeCommandList,
	popupChangeCommandList: popupChangeCommandList,
}
