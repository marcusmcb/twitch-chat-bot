const dotenv = require('dotenv')

dotenv.config()

const getBoolean = (name, fallback = false) => {
	const value = process.env[name]
	if (value === undefined) return fallback
	return value === 'true'
}

const getNumber = (name, fallback) => {
	const value = Number(process.env[name])
	return Number.isFinite(value) ? value : fallback
}

const requireValue = (missing, name, value) => {
	if (!value) missing.push(name)
}

const appConfig = {
	port: getNumber('PORT', 5000),
	twitch: {
		botUsername: process.env.TWITCH_BOT_USERNAME,
		oauthToken: process.env.TWITCH_OAUTH_TOKEN,
		channelName: process.env.TWITCH_CHANNEL_NAME,
		clientId: process.env.TWITCH_CLIENT_ID,
		clientSecret: process.env.TWITCH_CLIENT_SECRET,
		authCode: process.env.TWITCH_AUTH_CODE,
		broadcasterId: process.env.TWITCH_BROADCASTER_ID,
		eventSubSecret: process.env.TWITCH_EVENTSUB_SECRET,
	},
	obs: {
		enabled: getBoolean('DISPLAY_OBS_MESSAGES'),
		websocketAddress:
			process.env.OBS_TCP_ADDRESS || process.env.OBS_WEBSOCKET_ADDRESS,
		websocketPassword: process.env.OBS_WEBSOCKET_PASSWORD,
		requestTimeoutMs: getNumber('OBS_REQUEST_TIMEOUT_MS', 5000),
		displayDuration: getNumber('OBS_DISPLAY_DURATION', 5000),
	},
	autoCommands: {
		enabled: getBoolean('DISPLAY_INTERVAL_MESSAGES'),
		intervalMs: getNumber('AUTO_COMMAND_INTERVAL', 600000),
	},
	openWeather: {
		apiKey: process.env.OPEN_WEATHER_API_KEY,
	},
	openAi: {
		apiKey: process.env.OPENAI_API_KEY,
		chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo',
	},
	urbanDictionary: {
		apiKey: process.env.URBAN_DICTIONARY_API_KEY,
		apiHost: process.env.URBAN_DICTIONARY_API_HOST,
	},
	herokuUrl: process.env.HEROKU_URL,
}

appConfig.getMissingRequiredConfig = () => {
	const missing = []

	requireValue(missing, 'TWITCH_BOT_USERNAME', appConfig.twitch.botUsername)
	requireValue(missing, 'TWITCH_OAUTH_TOKEN', appConfig.twitch.oauthToken)
	requireValue(missing, 'TWITCH_CHANNEL_NAME', appConfig.twitch.channelName)
	requireValue(missing, 'TWITCH_CLIENT_ID', appConfig.twitch.clientId)
	requireValue(missing, 'TWITCH_CLIENT_SECRET', appConfig.twitch.clientSecret)
	requireValue(missing, 'TWITCH_BROADCASTER_ID', appConfig.twitch.broadcasterId)
	requireValue(missing, 'TWITCH_EVENTSUB_SECRET', appConfig.twitch.eventSubSecret)
	requireValue(missing, 'HEROKU_URL', appConfig.herokuUrl)

	if (appConfig.obs.enabled) {
		requireValue(missing, 'OBS_WEBSOCKET_ADDRESS', appConfig.obs.websocketAddress)
		requireValue(missing, 'OBS_WEBSOCKET_PASSWORD', appConfig.obs.websocketPassword)
	}

	if (appConfig.autoCommands.enabled) {
		requireValue(missing, 'AUTO_COMMAND_INTERVAL', appConfig.autoCommands.intervalMs)
	}

	return missing
}

module.exports = appConfig