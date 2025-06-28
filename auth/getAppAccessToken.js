const axios = require('axios')

const getAppAccessToken = async () => {
	try {
		const response = await axios.post(
			'https://id.twitch.tv/oauth2/token',
			null,
			{
				params: {
					client_id: process.env.TWITCH_CLIENT_ID,
					client_secret: process.env.TWITCH_CLIENT_SECRET,
					grant_type: 'client_credentials', // App Access Token
				},
			}
		)
		const { access_token } = response.data
		if (access_token) {
			console.log('----------------------------------')
			console.log('App Access Token generated successfully.')
		}

		return access_token
	} catch (error) {
		console.error(
			'Error generating App Access Token:',
			error.response?.data || error.message
		)
		throw error
	}
}

module.exports = { getAppAccessToken }
