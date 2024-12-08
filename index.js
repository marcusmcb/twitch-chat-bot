// dependencies
const tmi = require('tmi.js')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')

const {
	commandList,
	sceneChangeCommandList,
} = require('./command-list/commandList')

const autoCommandsConfig = require('./auto-commands/config/autoCommandsConfig')
const obs = require('./obs/obsConnection') 

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// configure CORS for the emote wall overlay
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
app.get('/auth/callback', (req, res) => {
	const authCode = req.query.code
	if (authCode) {
		console.log('Authorization Code:', authCode)
		res.send('Authorization Code received. Check your console for the code.')
	} else {
		res.send('Authorization Code not found.')
	}
})

// set up the HTTPS server with SSL options
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'https://marcusmcb.github.io',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
	transports: ['polling', 'websocket'], // ensure fallback support
})

// remove the old HTTP server setup and start the HTTPS server
server.listen(PORT, '0.0.0.0', () => {
	console.log(`--- HTTPS server is listening on port ${PORT} ---`)
})

// bot logic and TMI client config and connection
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

// OBS connection initialization
;(async () => {
	try {		
		await obs.connect()
		console.log('OBS connection ready for commands')
	} catch (error) {
		console.error('Failed to connect to OBS via ngrok:', error.message)
	}
})()

// load in the auto commands config
autoCommandsConfig(client, obs)

// create a socket connection to the static emotes overlay page
io.on('connection', (socket) => {
	console.log('A user connected:', socket.id)

	socket.on('disconnect', (reason) => {
		console.log('A user disconnected:', socket.id, reason)
	})

	socket.on('ping', () => {
		console.log('Ping received from client')
		socket.emit('pong')
	})
})

// global scene change lock value
const sceneChangeLock = { active: false }

client.on('message', (channel, tags, message, self) => {
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
			sceneChangeCommandList[command](
				channel,
				tags,
				args,
				client,
				obs,
				command,
				sceneChangeLock
			)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		} else {
			commandList[command](
				channel,
				tags,
				args,
				client,
				obs,
				sceneChangeLock
			)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		}
	}
})
