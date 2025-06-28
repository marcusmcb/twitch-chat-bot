const crypto = require('crypto')

// helper method to verify the signature of incoming Twitch EventSub notifications
const verifySignature = (req, secret) => {
	const message = `${req.header('Twitch-Eventsub-Message-Id')}${req.header(
		'Twitch-Eventsub-Message-Timestamp'
	)}${req.rawBody}`
	const signature = crypto
		.createHmac('sha256', secret)
		.update(message)
		.digest('hex')
	return `sha256=${signature}`
}

module.exports = { verifySignature }
