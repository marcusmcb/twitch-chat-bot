const createLiveReport = require('./createLiveReport')

const dotenv = require('dotenv')
dotenv.config()

const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`;
// const url = 'https://serato.com/playlists/DJ_Marcus_McBride/sunday-night-stream'

const statsCommand = async (channel, tags, args, client, obs) => {
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
				`${tags.username} has played ${reportData.total_tracks_played} songs so far in this set with an average length of ${reportData.average_track_length} per song.`
			)

			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `${tags.username} has played ${reportData.total_tracks_played} songs so far\nin this stream at an average of ${reportData.average_track_length} per song.`,
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
	} catch (err) {
		console.log(err)
		client.say(channel, "That doesn't appear to be working right now.")
	}
}

module.exports = {
	statsCommand: statsCommand,				
}
