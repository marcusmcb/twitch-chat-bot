const WebSocket = require('ws')
const crypto = require('crypto')

const OBS_TCP_ADDRESS = process.env.OBS_TCP_ADDRESS // ngrok TCP address (e.g., ws://7.tcp.ngrok.io:21711)
const OBS_PASSWORD = process.env.OBS_WEBSOCKET_PASSWORD // Your OBS WebSocket password

let obsConnection // Declare obsConnection here

const connectToOBS = () => {
	return new Promise((resolve, reject) => {
		obsConnection = new WebSocket(OBS_TCP_ADDRESS)

		obsConnection.on('open', () => {
			console.log('Connected to OBS WebSocket via ngrok')
		})

		obsConnection.on('message', async (data) => {
			const message = JSON.parse(data)
			console.log('Received from OBS:', message)

			if (message.op === 0) {
				// Handle the "Hello" message from OBS
				const { authentication, rpcVersion } = message.d

				if (authentication) {
					const { challenge, salt } = authentication
					const authToken = generateAuthenticationToken(
						OBS_PASSWORD,
						salt,
						challenge
					)

					// Send Identify message
					const identifyPayload = {
						op: 1,
						d: {
							rpcVersion,
							authentication: authToken,
						},
					}

					obsConnection.send(JSON.stringify(identifyPayload))
					console.log('Sent Identify message')
				}
			} else if (message.op === 2 && message.d?.negotiatedRpcVersion) {
				// Handle "Identified" response
				console.log('OBS WebSocket connection authenticated successfully')

				const testMessage = {
					op: 6,
					d: {
						requestType: 'GetCurrentProgramScene', // Updated request type
						requestId: 'test-request-1',
					},
				}

				obsConnection.send(JSON.stringify(testMessage))
				console.log('Test message sent to OBS')

				resolve(obsConnection) // Resolve the promise after authentication and message send
			}
		})

		obsConnection.on('error', (error) => {
			console.error('Error connecting to OBS WebSocket:', error.message)
			reject(error)
		})

		obsConnection.on('close', () => {
			console.log('Disconnected from OBS WebSocket')
		})
	})
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
