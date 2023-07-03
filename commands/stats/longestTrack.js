const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

// const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`;
const url = 'https://serato.com/playlists/DJ_Marcus_McBride/sunday-night-stream'

const longestTrackCommand = async (channel, tags, args, client, obs) => {
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
				`The longest song in ${tags.username}'s set (so far) is ${reportData.longest_track.name} (${reportData.longest_track.length_value})`
			)
		}
		obs.call('SetInputSettings', {
			inputName: 'obs-chat-response',
			inputSettings: {
				text: `Longest song in ${tags.username}'s set so far : \n\n${reportData.longest_track.name}\n(${reportData.longest_track.length_value})`,
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
  longestTrackCommand: longestTrackCommand
}