// dependencies
const tmi = require('tmi.js')
const appConfig = require('./config/appConfig')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const http = require('http')
const crypto = require('crypto')

// command registry
const { getCommand } = require('./command-registry/commandRegistry')

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

// global scene change lock value
const sceneChangeLock = { active: false }
const popupChangeLock = { active: false }
const countdownLock = { active: false }

const missingRequiredConfig = appConfig.getMissingRequiredConfig()
if (missingRequiredConfig.length > 0) {
	console.warn(
		`Missing recommended runtime config: ${missingRequiredConfig.join(', ')}`,
	)
}

const app = express()
const PORT = appConfig.port
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

const runCommandSafely = async (command, commandEntry, context) => {
	try {
		await commandEntry.execute(context)
	} catch (error) {
		console.error(`Error running command ${command}:`, error.message)
		context.client.say(
			context.channel,
			"Sorry, that command isn't working right now.",
		)
	}
}

// Twitch TMI client config for channel commands
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true,
	},
	identity: {
		username: appConfig.twitch.botUsername,
		password: appConfig.twitch.oauthToken,
	},
	channels: [appConfig.twitch.channelName],
})

// connect the Twitch TMI client
try {
	client.connect()
} catch (error) {
	console.log(error)
}

// OBS connection initialization
;(async () => {
	if (appConfig.obs.enabled) {
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
		const callbackUrl = `${appConfig.herokuUrl}/webhook`
		console.log('----------------------------------')
		console.log(`Using callback URL: ${callbackUrl}`)
		const accessToken = await getAppAccessToken()
		console.log('----------------------------------')
		console.log('App Access Token received successfully.')
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
		console.log('Authorization code received.')
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
	console.log('EventSub webhook received')
	console.log('-----------------')

	// verify the signature of the incoming notification
	const secret = appConfig.twitch.eventSubSecret
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
client.on('message', async (channel, tags, message, self) => {
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
	const commandEntry = getCommand(command)

	if (commandEntry) {
		if (!userCommandHistory[tags.username]) {
			userCommandHistory[tags.username] = []
		}

		let history = userCommandHistory[tags.username]
		const commandContext = {
			channel,
			tags,
			args,
			client,
			obs,
			command,
			locks: {
				sceneChangeLock,
				popupChangeLock,
				countdownLock,
			},
		}

		if (
			history.length >= COMMAND_REPEAT_LIMIT &&
			history.every((hist) => hist === command)
		) {
			client.say(
				channel,
				`@${tags.username}, try a different command before using that one again.`,
			)
		} else {
			console.log('Command called:', command)
			console.log('Command Type:', commandEntry.type)
			await runCommandSafely(command, commandEntry, commandContext)
			history.push(command)

			if (history.length > COMMAND_REPEAT_LIMIT) {
				history.shift()
			}
		}
	}
})
