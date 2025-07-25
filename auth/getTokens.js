const axios = require('axios')

// not currently being utilized anywhere
// utility function to generate tokens from Twitch auth code

const getTokens = async () => {
	console.log('GETTOKENS() CALLED')
	try {
		const tokenResponse = await axios.post(
			'https://id.twitch.tv/oauth2/token',
			{
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				code: process.env.TWITCH_AUTH_CODE,
				grant_type: 'authorization_code',
				redirect_uri: 'https://localhost:5000/auth/callback', 
			}
		)
		if (tokenResponse) {
			console.log(tokenResponse.data)
			const { access_token, refresh_token } = tokenResponse.data
			console.log('Access Token:', access_token)
			console.log('Refresh Token:', refresh_token)
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
