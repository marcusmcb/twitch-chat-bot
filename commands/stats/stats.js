const createLiveReport = require('./createLiveReport')
const dotenv = require('dotenv')

dotenv.config()

const displayStatsMessage = (obs, tags, reportData, direction) => {
	let differenceParsed = parseFloat(reportData.average_change.difference).toString().slice(0, -1)
	// differenceParsed = differenceParsed.slice(0, -1)
	const message = `${tags.username} has played ${
		reportData.total_tracks_played
	} songs so far\nin this stream at an average of ${
		reportData.average_track_length
	} per song ${direction}${differenceParsed}%)`
	obs.call('SetInputSettings', {
		inputName: 'obs-chat-response',
		inputSettings: {
			text: message,
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
}

const statsCommand = async (channel, tags, args, client, obs, url) => {
	try {
		const reportData = await createLiveReport(url)
		// console.log(reportData)
		if (reportData.total_tracks_played === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else if (reportData.average_change.isLarger) {
			client.say(
				channel,
				`${tags.username} has played ${reportData.total_tracks_played} songs so far in this set with an average length of ${reportData.average_track_length} per song.`
			)
			displayStatsMessage(obs, tags, reportData, '(↑')
		} else if (
			!reportData.average_change.isLarger &&
			reportData.average_change.difference !== null
		) {
			client.say(
				channel,
				`${tags.username} has played ${reportData.total_tracks_played} songs so far in this set with an average length of ${reportData.average_track_length} per song.`
			)
			displayStatsMessage(obs, tags, reportData, '(↓')
		}
	} catch (err) {
		console.log(err)
		client.say(channel, "That doesn't appear to be working right now.")
	}
}

module.exports = {
	statsCommand: statsCommand,
}
