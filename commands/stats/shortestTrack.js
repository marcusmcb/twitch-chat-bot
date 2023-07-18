const dotenv = require('dotenv')
const createLiveReport = require('./createLiveReport')
const clearOBSResponse = require('../../obs/obsHelpers/obsHelpers')

dotenv.config()

const displayOBSResponse = process.env.DISPLAY_OBS_MESSAGES

const displayShortestTrackMessage = (obs, tags, reportData) => {
	let message = `Shortest song in ${tags.username}'s set so far : \n\n${reportData.shortest_track.name}\n${reportData.shortest_track.length_value} (played ${reportData.shortest_track.time_since_played_string})`
	obs.call('SetInputSettings', {
		inputName: 'obs-chat-response',
		inputSettings: {
			text: message,
		},
	})
	clearOBSResponse(obs)
}

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
			if (displayOBSResponse === 'true') {
				displayShortestTrackMessage(obs, tags, reportData)
			}
		}
	} catch (error) {
		console.log(error)
		client.say(channel, "That doesn't appear to be working right now.")
	}
}

module.exports = {
	shortestTrackCommand: shortestTrackCommand,
}
