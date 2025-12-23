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
	npChatbotInfo: npChatbotInfo,
	discordInfo: discordInfo,
	generalCommandInfo: generalCommandInfo,
	my: myCommand,
	lotto: lottoCommand,
	birdcam: birdcamCommand,
	u: uCommand,
	hug: hugCommand,
	floaty: floatyCommand,
	blackjack: blackjackCommand,
	post: postCommand,
	nomic: noMicCommand,
	gsd: gsdCommand,
	turnt: turntCommand,
	cake: cakeCommand,
	fortune: fortuneCommand,
	ye: yeQuoteCommand,
	nuts: nutsCommand,
	raid: raidCommand,
	bits: bitsCommand, // mods & streamers only
	askgpt: askGPTCommand,
	stuffed: stuffedCommand,
	countdown: countdownCommand,
	eric: ericCommand,
	guttercheck: guttercheckCommand,
	cans: cansCommand,
	highlow: highLowCommand,
	culture: cultureCommand,
	knows: knowsCommand,
	discord: discordCommand,
	lit: litCommand,
	high: highCommand,
	borked: borkedCommand,
	respek: respekCommand,
	npchatbot: npChatbotLinkCommand,
	yy: yyCommand,
	greercity: greerCityCommand,
	port: portCommand,
	tonight: tonightCommand,
	skidaddle: skidaddleCommand,
	beefcake: beefcakeCommand,
	portex: portexCommand,
	playlists: playlistsCommand,
	dingus: dingusCommand,
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
