const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

const longestTrackCommand = async (channel, tags, args, client, obs, url) => {
	try {
		const reportData = await createLiveReport(url)
		console.log(reportData.longest_track.time_since_played.split(':'))
		if (reportData.total_tracks_played === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else {
			client.say(
				channel,
				`The longest song in ${tags.username}'s set (so far) is ${reportData.longest_track.name} (${reportData.longest_track.length_value})`
			)
		}
		if (reportData.longest_track.time_since_played.split(':')[0] === '00') {
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `Longest song in ${tags.username}'s set so far : \n\n${reportData.longest_track.name}\n(${reportData.longest_track.length_value}) - played ${reportData.longest_track.time_since_played.split(':')[1]} minutes ago`,
				},
			})
		} else {
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `Longest song in ${tags.username}'s set so far : \n\n${reportData.longest_track.name}\n(${reportData.longest_track.length_value}) - played ${reportData.longest_track.time_since_played.split(':')[0]} hour(s) and ${reportData.longest_track.time_since_played.split(':')[1]} minute(s) ago`,
				},
			})
		}

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
	longestTrackCommand: longestTrackCommand,
}
