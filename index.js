// dependencies
const tmi = require('tmi.js')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')
const crypto = require('crypto')

// command lists
const {
	commandList,
	sceneChangeCommandList,
	popupChangeCommandList,
} = require('./command-list/commandList')

// Twitch EventSub auth handlers
const { getAppAccessToken } = require('./auth/getAppAccessToken')
const { verifySignature } = require('./auth/helpers/verifySignature')
const {
	createEventSubSubscription,
} = require('./event-sub-handlers/eventSubHandlers')

// OBS, channel redemption, and interval notifications config
const autoCommandsConfig = require('./auto-commands/config/autoCommandsConfig')
const obs = require('./obs/obsConnection')
const { redemptionHandler } = require('./redemptions/redemptionHandler')

dotenv.config()

// global scene change lock value
const sceneChangeLock = { active: false }
const popupChangeLock = { active: false }
const countdownLock = { active: false }

const app = express()
const PORT = process.env.PORT || 5000
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

// Twitch TMI client config for channel commands
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

// connect the Twitch TMI client
try {
	client.connect()
} catch (error) {
	console.log(error)
}

// OBS connection initialization
;(async () => {
	if (process.env.DISPLAY_OBS_MESSAGES === 'true') {
		try {
			await obs.connect()
			console.log('OBS connection ready for commands')
		} catch (error) {
			console.error('Failed to connect to OBS via ngrok:', error.message)
		}
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

// IIFE to set up the Twitch EventSub subscription
;(async () => {
	try {
		const callbackUrl = `${process.env.HEROKU_URL}/webhook`
		console.log('----------------------------------')
		console.log(`Using callback URL: ${callbackUrl}`)
		const accessToken = await getAppAccessToken()
		console.log('----------------------------------')
		console.log('App Access Token:', accessToken)
		await createEventSubSubscription(callbackUrl, accessToken)
	} catch (error) {
		console.error('Error setting up the Twitch EventSub: ', error.message)
	}
})()

// configure CORS for the emote wall overlay
app.use(
	cors({
		origin: 'https://marcusmcb.github.io',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	}),
)

app.use(
	express.json({
		verify: (req, res, buf) => {
			req.rawBody = buf // store the raw body as a buffer
		},
	}),
)

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

app.post('/update-pi-endpoint', express.json(), (req, res) => {
	const { url, secret } = req.body
	if (secret !== process.env.PI_UPDATE_SECRET) {
		return res.status(403).send('Forbidden')
	}
	if (url) {
		piEndpoint = url
		console.log('Updated Pi endpoint:', piEndpoint)
		res.status(200).send('Pi endpoint updated')
	} else {
		res.status(400).send('Missing url')
	}
})

// Twitch EventSub webhook endpoint and redemption handler
app.post('/webhook', async (req, res) => {
	console.log('Raw Body:', req.rawBody.toString())
	console.log('-----------------')

	// verify the signature of the incoming notification
	const secret = process.env.TWITCH_EVENTSUB_SECRET
	const expectedSignature = verifySignature(req, secret)
	const actualSignature = req.header('Twitch-Eventsub-Message-Signature') || ''
	const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
	const actualBuffer = Buffer.from(actualSignature, 'utf8')

	if (
		!actualSignature ||
		expectedBuffer.length !== actualBuffer.length ||
		!crypto.timingSafeEqual(expectedBuffer, actualBuffer)
	) {
		console.error('Invalid signature')
		return res.status(403).send('Forbidden')
	} else {
		console.log('Valid signature')
	}

	// process the message type
	const messageType = req.header('Twitch-Eventsub-Message-Type')
	console.log('Message Type:', messageType)

	if (messageType === 'webhook_callback_verification') {
		try {
			const challenge = req.body.challenge
			res.set('Content-Type', 'text/plain').status(200).send(challenge)
			console.log('Verification challenge sent')
		} catch (error) {
			console.error('Error handling verification:', error.message)
			res.status(500).send('Internal Server Error')
		}
	} else if (messageType === 'notification') {
		console.log('Handling notification')
		console.log('Event Type: ', req.body.subscription.type)
		console.log(
			'Channel Name: ',
			req.body.event.broadcaster_user_name || 'Unknown',
		)
		console.log('--------------------')
		if (
			req.body.subscription.type ===
			'channel.channel_points_custom_reward_redemption.add'
		) {
			console.log('Channel Point Redemption Event Received')
			console.log('Event Data: ', req.body.event)
			await redemptionHandler(
				obs,
				client,
				sceneChangeLock,
				req.body.event.broadcaster_user_name,
				req.body.event.reward.title,
				req.body.event.user_name,
			)
		}
		res.status(204).end()
	} else {
		console.error(`Unknown message type: ${messageType}`)
		res.status(400).send('Unknown message type')
	}
})

// Twitch TMI channel command handler
client.on('message', (channel, tags, message, self) => {
	if (tags.emotes) {
		// console.log('has emotes')
		console.log('EMOTES: ', tags.emotes)
		io.emit('chat-emote', tags.emotes)
	}

	if (self || !message.startsWith('!')) {
		return
	}

	const args = message.slice(1).split(' ')
	const command = args.shift().toLowerCase()

	if (
		command in commandList ||
		command in popupChangeCommandList ||
		command in sceneChangeCommandList
	) {
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
				`@${tags.username}, try a different command before using that one again.`,
			)
		} else if (command in popupChangeCommandList) {
			console.log('Pop up command called')
			popupChangeCommandList[command](
				channel,
				tags,
				args,
				client,
				obs,
				command,
				popupChangeLock,
			)
			history.push(command)
			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		} else if (command in sceneChangeCommandList) {
			console.log('Scene Change Command: ', command)
			console.log('---------------------')
			sceneChangeCommandList[command](
				channel,
				tags,
				args,
				client,
				obs,
				command,
				sceneChangeLock,
			)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		} else {
			console.log('Count Down Lock: ', countdownLock)
			commandList[command](
				channel,
				tags,
				args,
				client,
				obs,
				sceneChangeLock,
				countdownLock,
			)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		}
	}
})
