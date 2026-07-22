const axios = require('axios')
const appConfig = require('../config/appConfig')

const getAppAccessToken = async () => {
	try {
		const response = await axios.post(
			'https://id.twitch.tv/oauth2/token',
			null,
			{
				params: {
					client_id: appConfig.twitch.clientId,
					client_secret: appConfig.twitch.clientSecret,
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
