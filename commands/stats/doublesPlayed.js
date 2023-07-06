const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

const doublesCommand = async (channel, tags, args, client, obs, url) => {
	try {
		const reportData = await createLiveReport(url)
		if (reportData.total_tracks_played === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else if (reportData.doubles_played.length === 0) {
			client.say(
				channel,
				`${channel.slice(1)} has not rocked doubles so far in this set.`
			)
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `${tags.username} has not rocked doubles so far in this set.`,
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
		} else {
			client.say(
				channel,
				`${channel.slice(1)} has rocked doubles ${
					reportData.doubles_played.length
				} time(s) so far in this set.`
			)
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `${tags.username} has rocked doubles\n${
						reportData.doubles_played.length
					} time(s) so far in this set.\n\nLast song he played doubles with:\n${
						reportData.doubles_played[reportData.doubles_played.length - 1].name
					}`,
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
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	doublesCommand: doublesCommand,
}
