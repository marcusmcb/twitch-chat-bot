const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

// const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`;
const url = 'https://serato.com/playlists/DJ_Marcus_McBride/3-12-2022'

const statsCommand = async (channel, tags, args, client, obs) => {
	try {
		const reportData = await createLiveReport(url)
		console.log(reportData.track_array)
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
			}, 10000)
		}
	} catch (err) {
		console.log(err)
		client.say(channel, "That doesn't appear to be working right now.")
	}
}

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
				text: `Longest song in ${tags.username}'s set so far: \n\n${reportData.longest_track.name}\n(${reportData.longest_track.length_value})`,
			},
		})
		setTimeout(() => {
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: '',
				},
			})
		}, 10000)
	} catch (error) {
		console.log(error)
	}
}

const shortestTrackCommand = async (channel, tags, args, client, obs) => {
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
				text: `Shortest song in ${tags.username}'s set so far: \n\n${reportData.shortest_track.name}\n(${reportData.shortest_track.length_value})`,
			},
		})
		setTimeout(() => {
			obs.call('SetInputSettings', {
				inputName: 'obs-chat-response',
				inputSettings: {
					text: '',
				},
			})
		}, 10000)
	} catch (error) {
		console.log(error)
	}
}



const dypCommand = async (channel, tags, args, client, obs) => {
	if (args.length === 0) {
		client.say(
			channel,
			`Add an artist's name after the command to see if ${tags.username} has played them yet in this stream.`
		)
	} else {
		try {
			const reportData = await createLiveReport(url)
			let searchResults = []
			let searchTerm = `${args}`.replaceAll(',', ' ')
			for (let i = 0; i < reportData.track_array.length; i++) {
				// console.log(reportData.track_array[i])
				if (
					reportData.track_array[i]
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				) {
					searchResults.push(reportData.track_array[i])
				}
			}

			if (searchResults.length === 0) {
				client.say(
					channel,
					`${tags.username} has not played ${searchTerm} so far in this stream.`
				)
			} else if (searchResults.length === 1) {
				client.say(
					channel,
					`${tags.username} has played ${searchTerm} ${searchResults.length} time so far in this stream.`
				)
			} else if (searchResults.length > 1) {
				console.log(searchResults)
				client.say(
					channel,
					`${tags.username} has played ${searchTerm} ${searchResults.length} times so far in this stream.`
				)
			}
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = {
	statsCommand: statsCommand,	
	longestTrackCommand: longestTrackCommand,
	shortestTrackCommand: shortestTrackCommand,
	dypCommand: dypCommand,
}
