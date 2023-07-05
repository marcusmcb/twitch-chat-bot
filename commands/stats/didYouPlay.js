const dotenv = require('dotenv')

const createLiveReport = require('./createLiveReport')

dotenv.config()

const stringCleanUp = (query, str) => {
	console.log("anything? ")
	console.log(query, str)
	let escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	let pattern = new RegExp(`\\s*[.,-]*\\s*${escapedQuery}\\s*[.,-]*\\s*`, 'gi')
	let result = str.replace(pattern, '')
	return result.trim()
}

const dypCommand = async (channel, tags, args, client, obs, url) => {
	console.log("ARGS: ", args)
	let searchTerm = args.join(" ")
	console.log("ARGS JOINED", searchTerm)
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
			console.log('---------------------')
			console.log('Search Result Length: ')
			console.log(searchResults[searchResults.length - 1])
			console.log('---------------------')
			console.log(stringCleanUp(searchTerm, searchResults[searchResults.length - 1]))
			const lastSongPlayed = stringCleanUp(searchTerm, searchResults[searchResults.length - 1])
			if (searchResults.length === 0) {
				client.say(
					channel,
					`${tags.username} has not played '${searchTerm}' so far in this stream.`
				)
				obs.call('SetInputSettings', {
					inputName: 'obs-chat-response',
					inputSettings: {
						text: `${tags.username} has not played\n'${searchTerm}' so far in this stream.`,
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
			} else if (searchResults.length === 1) {
				client.say(
					channel,
					`${tags.username} has played '${searchTerm}' ${searchResults.length} time so far in this stream.`
				)
				obs.call('SetInputSettings', {
					inputName: 'obs-chat-response',
					inputSettings: {
						text: `${tags.username} has played\n'${searchTerm}' ${searchResults.length} time so far in this stream.\nLast song played by ${searchTerm} was :\n${lastSongPlayed}`,
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
			} else if (searchResults.length > 1) {
				client.say(
					channel,
					`${tags.username} has played '${searchTerm}' ${searchResults.length} times so far in this stream.`
				)
				obs.call('SetInputSettings', {
					inputName: 'obs-chat-response',
					inputSettings: {
						text: `${tags.username} has played\n'${searchTerm}' ${searchResults.length} times so far in this stream.\n\nLast ${searchTerm} song played was :\n${lastSongPlayed}`,
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
			console.log('HERE')
			console.log(error)
		}
	}
}

module.exports = {
	dypCommand: dypCommand,
}
