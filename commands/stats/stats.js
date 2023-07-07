const createLiveReport = require('./createLiveReport')

const dotenv = require('dotenv')

dotenv.config()

let previousAverageTrackLength = 0 // Global variable to store the previous average track length

const statsCommand = async (channel, tags, args, client, obs, url) => {
	try {
		const reportData = await createLiveReport(url);
		const currentAverageTrackLength = reportData.average_track_length; // The current average track length
		let change = ''; // Will store the text representing the change in average track length
		let percentageChange = 0; // Will store the percentage change in average track length

		// Check if the average track length has increased, decreased, or remained even
		if (currentAverageTrackLength > previousAverageTrackLength) {
			change = 'increased';
			if (previousAverageTrackLength !== 0) { // To avoid division by zero
				percentageChange = ((currentAverageTrackLength - previousAverageTrackLength) / previousAverageTrackLength) * 100;
			}
		} else if (currentAverageTrackLength < previousAverageTrackLength) {
			change = 'decreased';
			if (previousAverageTrackLength !== 0) { // To avoid division by zero
				percentageChange = ((previousAverageTrackLength - currentAverageTrackLength) / previousAverageTrackLength) * 100;
			}
		} else {
			change = 'remained even';
		}

		previousAverageTrackLength = currentAverageTrackLength; // Update the previous average track length

		if (reportData.total_tracks_played === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else {
			client.say(
				channel,
				`${tags.username} has played ${reportData.total_tracks_played} songs so far in this set with an average length of ${currentAverageTrackLength} per song.`
			)

			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: `${tags.username} has played ${reportData.total_tracks_played} songs so far\nin this stream at an average of ${currentAverageTrackLength} per song.`,
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
