// dependencies
const tmi = require('tmi.js')
const dotenv = require('dotenv')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const { commandList } = require('./command-list/commandList')
const autoCommandsConfig = require('./auto-commands/config/autoCommandsConfig')
const obs = require('./obs/obsConnection')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

const io = new Server(server, {
	cors: {
		// origin: "http://127.0.0.1:5500",
		origin: 'https://marcusmcb.github.io',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
})

dotenv.config()

const initializeBot = async (config) => {
	console.log("--- HERE ---")
	console.log("Ready to init bot with ", config)
	// let userCommandHistory = {}
	// const COMMAND_REPEAT_LIMIT = 10

	// const client = new tmi.Client({
	// 	options: { debug: true },
	// 	connection: {
	// 		secure: true,
	// 		reconnect: true,
	// 	},
	// 	identity: {
	// 		username: process.env.TWITCH_BOT_USERNAME,
	// 		password: process.env.TWITCH_OAUTH_TOKEN,
	// 	},
	// 	channels: [process.env.TWITCH_CHANNEL_NAME],
	// })

	// try {
	// 	client.connect()
	// } catch (error) {
	// 	console.log(error)
	// }

	// autoCommandsConfig(client, obs)

	// io.on('connection', (socket) => {
	// 	console.log('a user has connected')
	// })

	// server.listen(PORT, () => {
	// 	console.log(`--- listening on PORT ${PORT} ---`)
	// })

	// client.on('message', (channel, tags, message, self) => {
	// 	console.log('Message params: ')
	// 	console.log(channel)
	// 	console.log(tags.emotes)
	// 	console.log(message)
	// 	console.log(self)

	// 	if (tags.emotes) {
	// 		console.log('has emotes')
	// 		io.emit('chat-emote', tags.emotes)
	// 	}

	// 	if (self || !message.startsWith('!')) {
	// 		return
	// 	}

	// 	const args = message.slice(1).split(' ')
	// 	const command = args.shift().toLowerCase()

	// 	if (command in commandList) {
	// 		if (!userCommandHistory[tags.username]) {
	// 			userCommandHistory[tags.username] = []
	// 		}

	// 		let history = userCommandHistory[tags.username]

	// 		if (
	// 			history.length >= COMMAND_REPEAT_LIMIT &&
	// 			history.every((hist) => hist === command)
	// 		) {
	// 			client.say(
	// 				channel,
	// 				`@${tags.username}, try a different command before using that one again.`
	// 			)
	// 		} else {
	// 			commandList[command](channel, tags, args, client, obs)
	// 			history.push(command)

	// 			if (history.length > COMMAND_REPEAT_LIMIT) {
	// 				history.shift()
	// 			}
	// 		}
	// 	}
	// })
}

module.exports = initializeBot

// add additional commands
