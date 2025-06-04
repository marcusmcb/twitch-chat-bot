const axios = require('axios')

// helper method to delete existing subscriptions
const deleteExistingSubscriptions = async (appAccessToken) => {
	try {
		const response = await axios.get(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				headers: {
					'Client-ID': process.env.TWITCH_CLIENT_ID,
					Authorization: `Bearer ${appAccessToken}`, // Use App Access Token
				},
			}
		)
		const subscriptions = response.data.data
		for (const sub of subscriptions) {
			if (sub.type === 'channel.channel_points_custom_reward_redemption.add') {
				console.log(`Deleting subscription: ${sub.id}`)
				await axios.delete(
					`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`,
					{
						headers: {
							'Client-ID': process.env.TWITCH_CLIENT_ID,
							Authorization: `Bearer ${appAccessToken}`,
						},
					}
				)
			}
		}
	} catch (error) {
		console.error(
			'Error deleting existing subscriptions:',
			error.response?.data || error.message
		)
	}
}

// method to create a new event subscription
const createEventSubSubscription = async (callbackURL, appAccessToken) => {
	try {
		console.log('Creating new subscription...')
		await deleteExistingSubscriptions(appAccessToken) // remove old or existing subscriptions first
		const response = await axios.post(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				type: 'channel.channel_points_custom_reward_redemption.add',
				version: '1',
				condition: {
					broadcaster_user_id: process.env.TWITCH_BROADCASTER_ID,
				},
				transport: {
					method: 'webhook',
					callback: callbackURL,
					secret: process.env.TWITCH_EVENTSUB_SECRET,
				},
			},
			{
				headers: {
					'Client-ID': process.env.TWITCH_CLIENT_ID,
					Authorization: `Bearer ${appAccessToken}`,
					'Content-Type': 'application/json',
				},
			}
		)
		console.log('Subscription created:', response.data)
	} catch (error) {
		console.error(
			'Error creating subscription:',
			error.response?.data || error.message
		)
	}
}

module.exports = { createEventSubSubscription, deleteExistingSubscriptions }
