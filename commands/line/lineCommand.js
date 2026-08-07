const pickupLines = require('./pickupLines')

const NO_REPEAT_WINDOW_SIZE = 5
const recentLineIndexes = []

const randomLineIndex = (poolSize) => {
	if (poolSize <= 1) {
		return 0
	}

	const blockedIndexes = new Set(recentLineIndexes)
	const availableIndexes = []

	for (let index = 0; index < poolSize; index += 1) {
		if (!blockedIndexes.has(index)) {
			availableIndexes.push(index)
		}
	}

	if (availableIndexes.length === 0) {
		return Math.floor(Math.random() * poolSize)
	}

	const randomAvailableIndex = Math.floor(Math.random() * availableIndexes.length)
	return availableIndexes[randomAvailableIndex]
}

const rememberLineIndex = (lineIndex) => {
	recentLineIndexes.push(lineIndex)

	if (recentLineIndexes.length > NO_REPEAT_WINDOW_SIZE) {
		recentLineIndexes.shift()
	}
}

const toSingleSentence = (line) => {
	const trimmedLine = typeof line === 'string' ? line.trim() : ''
	if (trimmedLine.length === 0) {
		return trimmedLine
	}

	const firstPeriodIndex = trimmedLine.indexOf('.')
	if (firstPeriodIndex === -1) {
		return trimmedLine
	}

	return trimmedLine.slice(0, firstPeriodIndex + 1)
}

const lineCommand = (channel, tags, args, client) => {
	const username = tags && tags.username ? tags.username : 'friend'

	if (pickupLines.length === 0) {
		client.say(channel, `@${username}, my pickup-line jar is empty right now.`)
		return
	}

	const nextIndex = randomLineIndex(pickupLines.length)
	rememberLineIndex(nextIndex)
	const selectedLine = toSingleSentence(pickupLines[nextIndex])

	client.say(channel, `@${username}, ${selectedLine}`)
}

module.exports = {
	lineCommand: lineCommand,
}
