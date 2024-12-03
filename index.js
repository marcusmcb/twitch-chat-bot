// dependencies
const tmi = require('tmi.js')
const dotenv = require('dotenv')
const https = require('https')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const {
	commandList,
	sceneChangeCommandList,
} = require('./command-list/commandList')

const autoCommandsConfig = require('./auto-commands/config/autoCommandsConfig')
const obs = require('./obs/obsConnection')
const sceneChangeCommand = require('./commands/sceneChangeCommand/sceneChangeCommand')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// SSL options
const sslOptions = {
	key: Buffer.from(process.env.SERVER_KEY_BASE64, 'base64'),
	cert: Buffer.from(process.env.SERVER_CERT_BASE64, 'base64'),
}

// Configure CORS for the emote wall overlay
app.use(
	cors({
		origin: 'https://marcusmcb.github.io',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	})
)

app.use(express.json())

// endpoint to capture the authorization code
// when authorizing the script with Twitch

// the app authorization code returned should
// be stored in a local .env file for later use
// to generate the necessary access token
// used to validate channel point redemptions

app.get('/auth/callback', (req, res) => {
	const authCode = req.query.code
	if (authCode) {
		console.log('Authorization Code:', authCode)
		res.send('Authorization Code received. Check your console for the code.')
	} else {
		res.send('Authorization Code not found.')
	}
})

// Set up the HTTPS server with SSL options
const server = https.createServer(sslOptions, app)

const io = new Server(server, {
	cors: {
		origin: 'https://marcusmcb.github.io',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
	transports: ['polling', 'websocket'], // Ensure fallback support
})

// Remove the old HTTP server setup and start the HTTPS server
server.listen(PORT, () => {
	console.log(`--- HTTPS server is listening on https://localhost:${PORT} ---`)
})

// Remaining bot and socket.io logic
let userCommandHistory = {}
const COMMAND_REPEAT_LIMIT = 10

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true,
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN,
	},
	channels: [process.env.TWITCH_CHANNEL_NAME],
})

try {
	client.connect()
} catch (error) {
	console.log(error)
}

autoCommandsConfig(client, obs)

io.on('connection', (socket) => {
	console.log('a user has connected')
})

client.on('message', (channel, tags, message, self) => {
	// console.log('Message params: ');
	// console.log(channel);
	// console.log(tags);
	// console.log(tags.emotes);
	// console.log(message);
	// console.log(self);

	if (tags.emotes) {
		console.log('has emotes')
		io.emit('chat-emote', tags.emotes)
	}

	if (self || !message.startsWith('!')) {
		return
	}

	const args = message.slice(1).split(' ')
	const command = args.shift().toLowerCase()

	if (command in commandList || command in sceneChangeCommandList) {
		if (!userCommandHistory[tags.username]) {
			userCommandHistory[tags.username] = []
		}

		let history = userCommandHistory[tags.username]

		if (
			history.length >= COMMAND_REPEAT_LIMIT &&
			history.every((hist) => hist === command)
		) {
			client.say(
				channel,
				`@${tags.username}, try a different command before using that one again.`
			)
		} else if (command in sceneChangeCommandList) {
			console.log('HERE')
			sceneChangeCommandList[command](channel, tags, args, client, obs, command)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		} else {
			commandList[command](channel, tags, args, client, obs)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		}
	}
})
