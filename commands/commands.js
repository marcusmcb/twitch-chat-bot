const OBSWebSocket = require('obs-websocket-js').default

// Create an instance of OBSWebSocket
const obs = new OBSWebSocket()

// Function to connect to OBS
async function connectToOBS() {
	try {
		await obs.connect('ws://192.168.56.1:4455', 'Q4f0ZTLerOb7dgru') // Replace with your OBS WebSocket address
		console.log('Connected to OBS')
    // let x = await obs.call('')
    // console.log(x)
		// Register an event handler for incoming Twitch chat messages
		// Assuming you have a Twitch chat bot set up with appropriate event handling
		// twitchChatBot.on('message', (channel, tags, message) => {
		// 	if (message === '!hello') {
		// 		obs
		// 			.send('SetSourceRender', {
		// 				source: 'YourTextSourceName', // Replace with the name of the text source in OBS
		// 				render: true,
		// 			})
		// 			.catch(console.error)
		// 	}
		// })
	} catch (error) {
		console.error('Failed to connect to OBS:', error)
	}
}

// Call the connectToOBS function to establish a connection
connectToOBS()

const helloCommand = (channel, tags, args, client) => {
	client.say(channel, `@${tags.username}, what's good homie! 👋👋👋`)
	async function updateTextSource() {
    try {
      obs.call('SetInputSettings', {
        'inputName': 'hello-command',
        'inputSettings': {
          'text': 'Hello world!'
        }
      })
      setTimeout(() => {
        obs.call('SetInputSettings', {
          'inputName': 'hello-command',
          'inputSettings': {
            'text': ''
          }
        })
      }, 5000)
      // const response = await obs.call('SetTextGDIPlusProperties', {
      //   source: 'hello-command', // Replace with the name of the text source in OBS
      //   text: { text: 'Hello!' } // The text content you want to display
      // });
  
      // console.log('Text source updated:', response);
    } catch (error) {
      console.error('Failed to update text source:', error);
    }
  }
  
  updateTextSource();
  

	// obs.call('SetTextGDIPlusProperties', {
	//   source: 'hello-command',
	//   text: 'Hello from the bot!'
	// })
}

const lurkCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`@${tags.username} is gonna be over there, doin' whatever...`
	)
}

const backCommand = (channel, tags, args, client) => {
	client.say(channel, `Lurk no more... @${tags.username} has returned!`)
}

const fadedCommand = (channel, tags, args, client) => {
	const fadedResult = Math.floor(Math.random() * 100) + 1
	client.say(channel, `@${tags.username} is ${fadedResult}% faded right now.`)
}

const linksCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can find all of my socials & links @ http://www.djmarcusmcbride.com`
	)
}

const cratestatsCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'DJs - Want to learn more about what you actually did during your last DJ set?  Check out http://www.cratestats.com to learn more about data analytics for DJs.'
	)
}
const areacodeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`
	)
}
const scCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		`You can check out MarcusMCB's Soundcloud page over @ https://soundcloud.com/marcusmcbride.`
	)
}

const primeCommand = (channel, tags, args, client) => {
	const channelName = channel.slice(1).split('#')
	client.say(
		channel,
		`Got Amazon Prime? Subscribe to the channel for free! https://subs.twitch.tv/${channelName}`
	)
}

const codeCommand = (channel, tags, args, client) => {
	client.say(
		channel,
		'Streaming tools for Twitch, Twitter & more: https://github.com/marcusmcb'
	)
}

const diceCommand = (channel, tags, args, client) => {
	const result = Math.floor(Math.random() * 6) + 1
	client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`)
}

const smortCommand = (channel, tags, args, client) => {
	let smortValue = Math.floor(Math.random() * 101)
	client.say(channel, `@${tags.username} is ${smortValue}% SMORT!`)
}

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
}
