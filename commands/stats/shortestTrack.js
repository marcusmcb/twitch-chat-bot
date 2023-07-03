const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

const shortestTrackCommand = async (channel, tags, args, client, obs, url) => {
	try {
		const reportData = await createLiveReport(url)
		if (reportData.total_tracks_played === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else {
			client.say(
				channel,
				`The shortest song in ${tags.username}'s set (so far) is ${reportData.shortest_track.name} (${reportData.shortest_track.length_value})`
			)
		}
		obs.call('SetInputSettings', {
			inputName: 'obs-chat-response',
			inputSettings: {
				text: `Shortest song in ${tags.username}'s set so far : \n\n${reportData.shortest_track.name}\n(${reportData.shortest_track.length_value})`,
			},
		})
		setTimeout(() => {
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: '',
				},
			})
		}, 5000)
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	shortestTrackCommand: shortestTrackCommand,
}
