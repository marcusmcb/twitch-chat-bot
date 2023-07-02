const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')

const {
	parseDateAndTime,
	convertMilliseconds,
	parseTrackTimestamps,
	calculateTimeDifferences,
	calculateAverageTrackLength,
} = require('./helpers/statsHelpers')

const createLiveReport = require('./createLiveReport')

dotenv.config()

// const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`;
const url = 'https://serato.com/playlists/DJ_Marcus_McBride/3-12-2022'

const statsCommand = async (channel, tags, args, client, obs) => {
	try {
		const { data } = await axios.get(url)
		const $ = cheerio.load(data)

		const playlistDate = $('span.playlist-start-time').first().text().trim()
		const { timestampsParsed, trackTimestamps } = parseTrackTimestamps(
			$,
			playlistDate
		)
		const timeDiffs = calculateTimeDifferences(trackTimestamps)
		const averageTrackLength = calculateAverageTrackLength(timeDiffs)
		let reportData
		await createLiveReport(url).then((data) => {
			console.log('DATA: ')
			console.log(data)
			reportData = data
		})

		reportData.doubles_played.forEach((item) => console.log(item))

		if (timeDiffs.length === 0) {
			client.say(
				channel,
				'Sorry, no playlist stats for this stream at the moment.'
			)
		} else {
			// client.say(
			// 	channel,
			// 	`${channel.slice(1)} has played ${
			// 		timeDiffs.length + 1
			// 	} songs so far in this set with an average length of ${averageTrackLength} per song.`
			// )

			// client.say(
			// 	channel,
			// 	`${channel.slice(1)} has rocked doubles ${
			// 		reportData.doubles_played.length
			// 	} times so far in this set.`
			// )

			client.say(
				channel,
				`The longest song in ${channel.slice(1)}'s set (so far) is: ${
					reportData.longest_track.name
				} (${reportData.longest_track.length_value})`
			)

			obs.call('SetInputSettings', {
				inputName: 'hello-command',
				inputSettings: {
					text: `${tags.username} has played ${
						timeDiffs.length + 1
					} songs so far\nin this stream at an average of ${averageTrackLength} per song`,
				},
			})			

			obs.call('SetInputSettings', {
				inputName: 'hello-command',
				inputSettings: {
					text: `${channel.slice(1)} has rocked doubles\n${
						reportData.doubles_played.length
					} times so far in this set.\n\nLast song he played doubles with:\n${
						reportData.doubles_played[reportData.doubles_played.length - 1].name
					}`,
				},
			})			

			// obs.call('SetInputSettings', {
			// 	inputName: 'hello-command',
			// 	inputSettings: {
			// 		text: `Longest song in ${channel.slice(1)}'s set so far?\n\n${
			// 			reportData.longest_track.name
			// 		}\n(${reportData.longest_track.length_value})`,
			// 	},
			// })

			setTimeout(() => {
				obs.call('SetInputSettings', {
					inputName: 'hello-command',
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

module.exports = {
	statsCommand: statsCommand,
}
