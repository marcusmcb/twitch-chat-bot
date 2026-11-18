const axios = require('axios')
const appConfig = require('../config/appConfig')

const normalizeOAuthToken = (token) =>
	String(token || '').trim().replace(/^oauth:/i, '')

const validateEventSubToken = async (eventSubToken) => {
	const normalizedToken = normalizeOAuthToken(eventSubToken)
	if (!normalizedToken) {
		throw new Error('TWITCH_EVENTSUB_TOKEN is not configured')
	}

	const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
		headers: {
			Authorization: `OAuth ${normalizedToken}`,
		},
	})

	const scopes = response.data.scopes || []
	if (!scopes.includes('moderator:read:followers')) {
		throw new Error(
			'TWITCH_EVENTSUB_TOKEN is missing the moderator:read:followers scope',
		)
	}

	return response.data
}

// helper method to delete existing subscriptions
const deleteExistingSubscriptions = async (
	appAccessToken,
	eventSubToken,
) => {
	console.log("---------------------------------")
	console.log('Deleting existing subscriptions...')
	
	try {
		const owners = [
			{
				token: appAccessToken,
				types: new Set([
					'channel.follow',
					'channel.channel_points_custom_reward_redemption.add',
				]),
			},
		]

		for (const owner of owners) {
			if (!owner.token) continue

			const response = await axios.get(
				'https://api.twitch.tv/helix/eventsub/subscriptions',
				{
					headers: {
						'Client-ID': appConfig.twitch.clientId,
						Authorization: `Bearer ${owner.token}`,
					},
				}
			)

			for (const sub of response.data.data) {
				if (owner.types.has(sub.type)) {
					console.log("---------------------------------")
					console.log(`Deleting subscription: ${sub.id}`)

					await axios.delete(
						`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`,
						{
							headers: {
								'Client-ID': appConfig.twitch.clientId,
								Authorization: `Bearer ${owner.token}`,
							},
						}
					)
				}
			}
		}
	} catch (error) {
		console.log("---------------------------------")
		console.error(
			'Error deleting existing subscriptions:',
			error.response?.data || error.message
		)
	}
}

// add header handler method and import here to resolve
// subscription creation missing proper auth issue

// check with GPT if new EVENTSUB credentials are required
// here as well

// method to create a new event subscription
const createEventSubSubscription = async (callbackURL, appAccessToken) => {
	try {
		console.log("----------------------")
		console.log('Creating new subscription...')
		console.log("Callback URL:", callbackURL)
		console.log("App Access Token available for EventSub subscription setup.")

		const eventSubToken = normalizeOAuthToken(appConfig.twitch.eventSubToken)
		const eventSubIdentity = await validateEventSubToken(eventSubToken)
		console.log(
			`EventSub user token validated for ${eventSubIdentity.login || 'Twitch account'}.`,
		)

		await deleteExistingSubscriptions(appAccessToken, eventSubToken)

		console.log("----------------------")
		const moderatorId =
			appConfig.twitch.moderatorId || appConfig.twitch.broadcasterId

		console.log('Creating subscription for follows...')
		const followResponse = await axios.post(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				type: 'channel.follow',
				version: '2',
				condition: {
					broadcaster_user_id: appConfig.twitch.broadcasterId,
					moderator_user_id: moderatorId,
				},
				transport: {
					method: 'webhook',
					callback: callbackURL,
					secret: appConfig.twitch.eventSubSecret,
				},
			},
			{
				headers: {
					'Client-ID': appConfig.twitch.clientId,
					Authorization: `Bearer ${appAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		)
		console.log('Follow subscription created:', followResponse.data)

		console.log("----------------------")
		console.log('Creating subscription for channel points redemptions...')
		console.log("Using Client ID:", appConfig.twitch.clientId)
		console.log("Using EventSub user token.")
		console.log("Using Callback URL:", callbackURL)
		console.log("EventSub signing secret configured.")
		console.log("----------------------")

		try {
			const response = await axios.post(
				'https://api.twitch.tv/helix/eventsub/subscriptions',
				{
					type: 'channel.channel_points_custom_reward_redemption.add',
					version: '1',
					condition: {
						broadcaster_user_id: appConfig.twitch.broadcasterId,
					},
					transport: {
						method: 'webhook',
						callback: callbackURL,
						secret: appConfig.twitch.eventSubSecret,
					},
				},
				{
					headers: {
						'Client-ID': appConfig.twitch.clientId,
						Authorization: `Bearer ${appAccessToken}`,
						'Content-Type': 'application/json',
					},
				}
			)
			console.log('Subscription created:', response.data)
		} catch (error) {
			console.error(
				'Error creating channel points redemption subscription:',
				error.response?.data || error.message,
			)
			console.error(
				'The EventSub token needs channel:read:redemptions or channel:manage:redemptions.',
			)
		}
	} catch (error) {

		console.error(
			'Error creating subscription:',
			error.response?.data || error.message
		)
		console.log("----------------------")
		// console.log("Full Error Response:", error)
	}
}

module.exports = { createEventSubSubscription, deleteExistingSubscriptions }
