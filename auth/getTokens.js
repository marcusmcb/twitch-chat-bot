const axios = require('axios')
const appConfig = require('../config/appConfig')

// not currently being utilized anywhere
// utility function to generate tokens from Twitch auth code

const getTokens = async () => {
	console.log('GETTOKENS() CALLED')
	try {
		const tokenResponse = await axios.post(
			'https://id.twitch.tv/oauth2/token',
			{
				client_id: appConfig.twitch.clientId,
				client_secret: appConfig.twitch.clientSecret,
				code: appConfig.twitch.authCode,
				grant_type: 'authorization_code',
				redirect_uri: 'https://localhost:5000/auth/callback', 
			}
		)
		if (tokenResponse) {
			const { access_token, refresh_token } = tokenResponse.data
			const primaryCredentialReceived = Boolean(access_token)
			const refreshCredentialReceived = Boolean(refresh_token)
			console.log(`Twitch primary credential received: ${primaryCredentialReceived}`)
			console.log(`Twitch refresh credential received: ${refreshCredentialReceived}`)
			return tokenResponse.data
		} else {
			console.log('No token response')
		}
	} catch (error) {
		console.error('Error getting tokens from Twitch:', error.response?.data || error.message)
		console.log(error)
	}
}

module.exports = { getTokens }
