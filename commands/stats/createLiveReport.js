const scrapeData = require('./LiveReportHelpers/scrapeData')
const parseTimeValues = require('./LiveReportHelpers/parseTimeValues')
const parseStartTime = require('./LiveReportHelpers/parseStartTime')
const calculateAverageTime = require('./LiveReportHelpers/calculateAverageTime')

const createLiveReport = async (url) => {
	const extractPlaylistName = (inputString) => {
		// Extract the portion of the string between 'playlists/' and '/4-3-2023'
		const regex = /playlists\/(.*?)\//
		const match = regex.exec(inputString)
		if (match && match[1]) {
			// Replace underscores with whitespace
			const playlistName = match[1].replace(/_/g, ' ')
			return playlistName
		}
		// Return null if no match is found
		return null
	}

	const playlistArtistName = extractPlaylistName(url)

	const parseDateAndTime = (timeString, playlistDate) => {
		const date = new Date(playlistDate)
		const [hours, minutes, seconds] = timeString.split(':')
		date.setHours(parseInt(hours, 10))
		date.setMinutes(parseInt(minutes, 10))
		date.setSeconds(parseInt(seconds, 10))
		return date
	}

	const createPlaylistDate = (timeString, playlistDate) => {
		let dateParts = playlistDate.split(' ')
		let dateObj = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
		let period = timeString.slice(-2) // AM or PM
		let [hours, minutes] = timeString.slice(0, -2).split(':') // Actual hours and minutes

		// Adjust hours for PM times
		if (period.toLowerCase() === 'pm' && hours !== '12') {
			hours = parseInt(hours) + 12
		} else if (period.toLowerCase() === 'am' && hours === '12') {
			hours = '00'
		}
		dateObj.setHours(hours, minutes)
		return dateObj
	}

	const sumTimeValues = (timeValue1, timeValue2) => {
		// Extract hours, minutes, and seconds from the time values
		const date1 = new Date(timeValue1)
		const date2 = new Date(timeValue2)
		const hours1 = date1.getHours()
		const minutes1 = date1.getMinutes()
		const seconds1 = date1.getSeconds()
		const hours2 = date2.getHours()
		const minutes2 = date2.getMinutes()
		const seconds2 = date2.getSeconds()

		// Calculate the total time in seconds
		const totalSeconds =
			seconds1 +
			seconds2 +
			minutes1 * 60 +
			minutes2 * 60 +
			hours1 * 3600 +
			hours2 * 3600

		// Convert the total time to hours, minutes, and seconds
		const hours = Math.floor(totalSeconds / 3600) % 12
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		// Determine whether it's AM or PM
		const ampm = hours < 12 ? 'AM' : 'PM'

		// Format the result as HH:MM:SS AM/PM
		const formattedHours = String(hours).padStart(2, '0')
		const formattedMinutes = String(minutes).padStart(2, '0')
		const formattedSeconds = String(seconds).padStart(2, '0')
		const result = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`

		return result
	}

	const compareTimes = (currentAverage, previousCurrentAverage) => {
		function parseTime(timeStr) {
			const [hours, minutes] = timeStr.split(':').map(Number)
			return hours * 60 * 60 * 1000 + minutes * 60 * 1000
		}

		const current = parseTime(currentAverage)
		const previous = parseTime(previousCurrentAverage)

		if (current > previous) {
			const difference = ((current - previous) / previous) * 100
			return {
				averageIncrease: true,
				difference: difference.toFixed(2),
			}
		} else if (current < previous) {
			const difference = ((previous - current) / previous) * 100
			return {
				averageIncrease: false,
				difference: difference.toFixed(2),
			}
		} else {
			return {
				averageIncrease: false,
				difference: null,
			}
		}
	}

	function convertTo24Hour(time) {
		const [, hours, minutes, seconds, modifier] =
			/(\d{2}):(\d{2}):(\d{2}) (AM|PM)/.exec(time)

		let hr = parseInt(hours, 10)

		if (modifier === 'PM' && hr < 12) {
			hr += 12
			s
		} else if (modifier === 'AM' && hr === 12) {
			hr = 0
		}

		return `${hr}:${minutes}:${seconds}`
	}

	const calculateTimeDifference = (currentTimestamp, previousTimestamp) => {
		const current24Hour = convertTo24Hour(currentTimestamp)
		const previous24Hour = convertTo24Hour(previousTimestamp)
		const currentDate = new Date(`1970-01-01 ${current24Hour}`)
		const previousDate = new Date(`1970-01-01 ${previous24Hour}`)

		let diff = Math.abs(currentDate.getTime() - previousDate.getTime())

		const hours = Math.floor(diff / 3_600_000)
		diff -= hours * 3_600_000
		const minutes = Math.floor(diff / 60_000)
		diff -= minutes * 60_000
		const seconds = Math.floor(diff / 1_000)
		const formatTime = (val) => String(val).padStart(2, '0')
		return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
	}

	const formatTimeSincePlayedString = (timeString) => {
		if (timeString.split(':')[0] === '00') {
			if (timeString.split(':')[1][0] === '0') {
				timeStringFormatted = `${timeString.split(':')[1][1]} minutes ago`
				console.log(timeStringFormatted)
			} else {
				timeStringFormatted = `${timeString.split(':')[1]} minutes ago`
				console.log(timeStringFormatted)
			}
		} else if (timeString.split(':')[1] === '00') {
			if (timeString.split(':')[2][0] === '0') {
				timeStringFormatted = `${timeString.split(':')[2][1]} seconds ago`
				console.log(timeStringFormatted)
			} else {
				timeStringFormatted = `${timeString.split(':')[2]} seconds ago`
				console.log(timeStringFormatted)
			}
		} else {
			// finish logic for this case
			let hours = timeString.split(':')[0]
			let minutes = timeString.split(':')[1]
			console.log('HOURS: ', hours, 'MINUTES: ', minutes)
			if (hours[0] === '0') {
				hours = hours[1]
			}
			if (minutes[0] === '0') {
				minutes = minutes[1]
			}
			timeStringFormatted = `${hours} hour and ${minutes} minutes ago`
			console.log(timeStringFormatted)
		}
		return timeStringFormatted
	}

	try {
		// function to scrape data for report
		let response = await scrapeData(url)
		let results = response[0]
		let timestamps = response[1]
		let starttime = response[2]
		let playlistdate = response[3]
		let playlistTitle = response[4]
		let tracksPlayed = []
		let trackTimestamps = []
		let doublesPlayed = []
		let timestampsParsed = []
		let startTimeString
		let starttimeParsed = createPlaylistDate(starttime, playlistdate)

		// parse start time for proper display in UI
		if (starttime.length === 7) {
			const [first, second] = parseStartTime(starttime, 5)
			startTimeString = first + ' ' + second.toUpperCase()
		} else {
			const [first, second] = parseStartTime(starttime, 4)
			startTimeString = first + ' ' + second.toUpperCase()
		}

		// loop through tracks played and clean data from scrape
		for (let i = 0; i < results.length; i++) {
			let trackId = results[i].children[0].data.trim()
			tracksPlayed.push(trackId)
		}

		// loop through track timestamps and clean data from scrape
		for (let j = 0; j < results.length; j++) {
			let timestamp = timestamps[j].children[0].data.trim()
			let timestampParsed = parseDateAndTime(timestamp, playlistdate)
			timestamp = new Date('01/01/1970 ' + timestamp)
			timestampsParsed.push(timestampParsed)
			trackTimestamps.push(timestamp)
		}

		// determine lengths of each track played
		let timeDiffs = []
		for (let k = 0; k < trackTimestamps.length; k++) {
			let x = trackTimestamps[k + 1] - trackTimestamps[k]
			if (Number.isNaN(x)) {
			} else {
				timeDiffs.push(x)
			}
		}

		// check for doubles and add those tracks to array
		for (let n = 0; n < tracksPlayed.length; n++) {
			if (tracksPlayed[n] === tracksPlayed[n + 1]) {
				doublesPlayed.push({
					name: tracksPlayed[n],
				})
			}
		}

		// master track log
		let trackLog = tracksPlayed.map((result, index) => {
			return {
				trackId: result,
				timestamp: sumTimeValues(starttimeParsed, timestampsParsed[index]),
				timePlayed: timestamps[index].children[0].data.trim(),
				length: timeDiffs[index],
			}
		})

		// create an array of track lengths in MS and send to
		// calculateAverageTime to convert and return average
		let msArray = []

		for (let i = 0; i < trackLog.length - 1; i++) {
			msArray.push(trackLog[i]['length'])
		}

		let lastMSArray = msArray.slice(0, -1)
		let averageTrackLength = calculateAverageTime(msArray)
		let previousAverageTrackLength = calculateAverageTime(lastMSArray)
		// console.log(averageTrackLength)
		// console.log(previousAverageTrackLength)
		let averageDifference = compareTimes(
			averageTrackLength,
			previousAverageTrackLength
		)

		// longest track played
		let longestSeconds
		let max = Math.max(...timeDiffs)
		let maxIndex = timeDiffs.indexOf(max)
		let longestTrack = Math.abs(
			(trackTimestamps[maxIndex] - trackTimestamps[maxIndex + 1]) / 1000
		)
		let longestMinutes = Math.floor(longestTrack / 60) % 60
		let tempLongestSeconds = longestTrack % 60

		// check length of longest seconds for display parsing
		if (tempLongestSeconds.toString().length === 1) {
			longestSeconds = '0' + tempLongestSeconds
		} else {
			longestSeconds = tempLongestSeconds
		}

		// shortest track played
		let shortestSeconds
		let min = Math.min(...timeDiffs)
		let minIndex = timeDiffs.indexOf(min)
		let shortestTrack = Math.abs(
			(trackTimestamps[minIndex] - trackTimestamps[minIndex + 1]) / 1000
		)
		let shortestMinutes = Math.floor(shortestTrack / 60) % 60
		let tempShortestSeconds = shortestTrack % 60

		// check length of shortest seconds for display parsing
		if (tempShortestSeconds.toString().length === 1) {
			shortestSeconds = '0' + tempShortestSeconds
		} else {
			shortestSeconds = tempShortestSeconds
		}

		// playlist length & parse hours/minutes/seconds
		let playlistLength = timestamps.last().text().trim()
		let playlistLengthValues = parseTimeValues(playlistLength)

		// playlist date formatting
		let playlistDateFormatted =
			playlistdate.split(' ')[1] +
			' ' +
			playlistdate.split(' ')[0] +
			', ' +
			playlistdate.split(' ')[2]

		const longestTrackDifference = calculateTimeDifference(
			trackLog[trackLog.length - 1].timestamp,
			trackLog[maxIndex].timestamp
		)
		const shortestTrackDifference = calculateTimeDifference(
			trackLog[trackLog.length - 1].timestamp,
			trackLog[minIndex].timestamp
		)

		let timeSinceLongestPlayed = formatTimeSincePlayedString(
			longestTrackDifference
		)
		let timeSinceShortestPlayed = formatTimeSincePlayedString(
			shortestTrackDifference
		)

		let seratoLiveReport = {
			track_length_array: timeDiffs,
			dj_name: playlistArtistName,
			set_length: {
				length_value: playlistLength,
				hours: new Number(playlistLengthValues[0]),
				minutes: new Number(playlistLengthValues[1]),
				seconds: new Number(playlistLengthValues[2]),
			},
			set_start_time: startTimeString,
			total_tracks_played: trackLog.length,
			longest_track: {
				name: trackLog[maxIndex].trackId,
				played_at: trackLog[maxIndex].timestamp,
				time_since_played: calculateTimeDifference(
					trackLog[trackLog.length - 1].timestamp,
					trackLog[maxIndex].timestamp
				),
				time_since_played_string: timeSinceLongestPlayed,
				length_value: longestMinutes + ':' + longestSeconds,
				minutes: longestMinutes,
				seconds: longestSeconds,
			},
			shortest_track: {
				name: trackLog[minIndex].trackId,
				played_at: trackLog[minIndex].timestamp,
				time_since_played: calculateTimeDifference(
					trackLog[trackLog.length - 1].timestamp,
					trackLog[minIndex].timestamp
				),
				time_since_played_string: timeSinceShortestPlayed,
				length_value: shortestMinutes + ':' + shortestSeconds,
				minutes: shortestMinutes,
				seconds: shortestSeconds,
			},
			average_track_length: averageTrackLength,
			average_change: {
				isLarger: averageDifference.averageIncrease,
				difference: averageDifference.difference,
			},
			track_log: trackLog,
			doubles_played: doublesPlayed,
			playlist_date: playlistDateFormatted,
			playlist_title: playlistTitle,
			track_array: tracksPlayed,
		}
		return seratoLiveReport
	} catch (err) {
		console.log(err)
	}
}
// FUTURE DEV NOTES
//
// calculate average tracks per hour for longer sets
//
// check if shortest track is part of a doubles pair
//
// add logic to determine longest track played @ time
// add logic to determine shortest track played @ time

module.exports = createLiveReport
