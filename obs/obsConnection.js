const WebSocket = require('ws')
const crypto = require('crypto')

const OBS_TCP_ADDRESS = process.env.OBS_TCP_ADDRESS
const OBS_PASSWORD = process.env.OBS_WEBSOCKET_PASSWORD

let obsConnection
let challenge = ''
let salt = ''
let requestIdCounter = 0 // to manage unique request IDs
const pendingRequests = new Map() // map to store pending requests

const connectToOBS = async () => {
	return new Promise((resolve, reject) => {
		try {
			obsConnection = new WebSocket(OBS_TCP_ADDRESS)

			obsConnection.on('open', async () => {
				console.log('Connected to OBS WebSocket via ngrok')
			})

			obsConnection.on('message', (data) => {
				const parsedData = JSON.parse(data)				

				if (parsedData.op === 0) {					
          // handle hello/init message
					challenge = parsedData.d.authentication.challenge
					salt = parsedData.d.authentication.salt
					const authToken = generateAuthenticationToken(
						OBS_PASSWORD,
						salt,
						challenge
					)

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
					// handle identified message
					console.log('OBS WebSocket connection authenticated successfully')
					resolve()
				} else if (parsedData.op === 7) {
					// handle request response
					const requestId = parsedData.d.requestId
					if (pendingRequests.has(requestId)) {
						const { resolve } = pendingRequests.get(requestId)
						resolve(parsedData.d.responseData)
						pendingRequests.delete(requestId)
					}
				}
			})

			obsConnection.on('close', (code, reason) => {
				console.log(
					`OBS WebSocket disconnected. Code: ${code}, Reason: ${reason}`
				)
				console.log('Attempting to reconnect...')
				setTimeout(() => connectToOBS().then(resolve).catch(reject), 1000) // Reconnect after 1 second
			})

			obsConnection.on('error', (error) => {
				console.error('OBS WebSocket error:', error.message)
				reject(error)
			})

		} catch (error) {
			console.error('Failed to connect to OBS WebSocket:', error.message)
			reject(error)
		}
	})
}

const call = (requestType, requestData = {}) => {
	return new Promise((resolve, reject) => {
		const requestId = `request-${++requestIdCounter}`
		const request = {
			op: 6, // request operation code
			d: {
				requestType,
				requestId,
				requestData,
			},
		}

		// console.log('Sending OBS Request:', request)
		pendingRequests.set(requestId, { resolve, reject })
		// error handling for when obsConnection is not ready
		if (obsConnection && obsConnection.readyState === WebSocket.OPEN) {
			obsConnection.send(JSON.stringify(request))
		} else {
			console.error('OBS WebSocket is not open. Request not sent.')
			reject(new Error('OBS WebSocket is not open.'))
		}
	})
}

// wrapper to expose both `obsConnection` and `call` throughout script
const obs = {
	connect: connectToOBS,
	call,
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

module.exports = obs
