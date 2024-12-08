const WebSocket = require('ws')
const crypto = require('crypto')

const OBS_TCP_ADDRESS = process.env.OBS_TCP_ADDRESS // ngrok TCP address (e.g., ws://7.tcp.ngrok.io:21711)
const OBS_PASSWORD = process.env.OBS_WEBSOCKET_PASSWORD // Your OBS WebSocket password

let obsConnection // Declare obsConnection here
let challenge = ''
let salt = ''

const connectToOBS = async () => {
	try {
		obsConnection = new WebSocket(OBS_TCP_ADDRESS)

		obsConnection.on('open', async () => {
			console.log('Connected to OBS WebSocket via ngrok')
		})

		obsConnection.on('message', (data) => {
			const parsedData = JSON.parse(data)
			console.log('Received from OBS:', parsedData)

			if (parsedData.op === 0) {
				// Handle Hello message
				challenge = parsedData.d.authentication.challenge
				salt = parsedData.d.authentication.salt

				// Debugging values
				console.log('Password:', OBS_PASSWORD)
				console.log('Salt:', salt)
				console.log('Challenge:', challenge)

				const authToken = generateAuthenticationToken(
					OBS_PASSWORD,
					salt,
					challenge
				)

				console.log('Generated Auth Token:', authToken)

				const authMessage = {
					op: 1,
					d: {
						rpcVersion: 1,
						authentication: authToken,
					},
				}

				obsConnection.send(JSON.stringify(authMessage))
				console.log('Sent Identify message')
			} else if (parsedData.op === 2) {
				// Handle Identified message
				console.log('OBS WebSocket connection authenticated successfully')
			} else if (parsedData.op === 7) {
				// Handle request response
				console.log('Request response from OBS:', parsedData)
			}
		})

		obsConnection.on('close', (code, reason) => {
			console.log(
				`OBS WebSocket disconnected. Code: ${code}, Reason: ${reason}`
			)
			console.log('Attempting to reconnect...')
			setTimeout(connectToOBS, 1000) // Reconnect after 1 second
		})

		obsConnection.on('error', (error) => {
			console.error('OBS WebSocket error:', error.message)
		})
	} catch (error) {
		console.error('Failed to connect to OBS WebSocket:', error.message)
		setTimeout(connectToOBS, 1000) // Retry connection after 1 second
	}
}

const generateAuthenticationToken = (password, salt, challenge) => {
	const secret = crypto
		.createHash('sha256')
		.update(password + salt)
		.digest('base64')
	return crypto
		.createHash('sha256')
		.update(secret + challenge)
		.digest('base64')
}

module.exports = { connectToOBS, obsConnection }
