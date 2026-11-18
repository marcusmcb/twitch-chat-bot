const axios = require('axios')
const appConfig = require('../config/appConfig')

const normalizeOAuthToken = (token) =>
	String(token || '').trim().replace(/^oauth:/i, '')

const validateEventSubToken = async (token) => {
	const normalizedToken = normalizeOAuthToken(token)
	if (!normalizedToken) return null

	try {
		const response = await axios.get(
			'https://id.twitch.tv/oauth2/validate',
			{
				headers: {
					Authorization: `OAuth ${normalizedToken}`,
				},
			},
		)
		return response.data
	} catch (error) {
		if (error.response?.status === 401) return null
		throw error
	}
}

const persistTwitchTokens = async (accessToken, refreshToken) => {
	if (!appConfig.heroku.apiToken || !appConfig.heroku.appName) {
		throw new Error(
			'HEROKU_API_TOKEN and HEROKU_APP_NAME are required to persist refreshed Twitch tokens',
		)
	}

	await axios.patch(
		`https://api.heroku.com/apps/${encodeURIComponent(appConfig.heroku.appName)}/config-vars`,
		{
			TWITCH_EVENTSUB_TOKEN: accessToken,
			TWITCH_REFRESH_TOKEN: refreshToken,
		},
		{
			headers: {
				Accept: 'application/vnd.heroku+json; version=3',
				Authorization: `Bearer ${appConfig.heroku.apiToken}`,
				'Content-Type': 'application/json',
			},
		},
	)
}

const refreshEventSubToken = async () => {
	const refreshToken = normalizeOAuthToken(
		appConfig.twitch.refreshToken,
	)
	if (!refreshToken) {
		throw new Error('TWITCH_REFRESH_TOKEN is not configured')
	}

	const response = await axios.post(
		'https://id.twitch.tv/oauth2/token',
		null,
		{
			params: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				client_id: appConfig.twitch.clientId,
				client_secret: appConfig.twitch.clientSecret,
			},
		},
	)

	const accessToken = normalizeOAuthToken(response.data.access_token)
	const rotatedRefreshToken = normalizeOAuthToken(
		response.data.refresh_token,
	)
	if (!accessToken || !rotatedRefreshToken) {
		throw new Error('Twitch refresh response did not contain both tokens')
	}

	await persistTwitchTokens(accessToken, rotatedRefreshToken)

	appConfig.twitch.eventSubToken = accessToken
	appConfig.twitch.refreshToken = rotatedRefreshToken

	return {
		accessToken,
		refreshToken: rotatedRefreshToken,
		expiresIn: response.data.expires_in,
		scopes: response.data.scope || [],
	}
}

const ensureValidEventSubToken = async () => {
	const currentToken = appConfig.twitch.eventSubToken
	let identity = await validateEventSubToken(currentToken)

	if (!identity) {
		console.log('Twitch EventSub access token is invalid; refreshing...')
		const refreshed = await refreshEventSubToken()
		identity = await validateEventSubToken(refreshed.accessToken)
		if (!identity) {
			throw new Error('Refreshed Twitch EventSub token failed validation')
		}
		return refreshed
	}

	return {
		accessToken: normalizeOAuthToken(currentToken),
		refreshToken: appConfig.twitch.refreshToken,
		expiresIn: identity.expires_in,
		scopes: identity.scopes || [],
	}
}

module.exports = {
	ensureValidEventSubToken,
	refreshEventSubToken,
	validateEventSubToken,
}
