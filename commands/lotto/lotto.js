const WebSocket = require('ws')

const lottoCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	sceneChangeLock
) => {
	const obsEnabled = process.env.DISPLAY_OBS_MESSAGES
	const wsAddress = 'ws://7.tcp.ngrok.io:21711' // Ngrok WebSocket address

	if (obsEnabled === 'true') {
		if (sceneChangeLock.active) {
			client.say(
				channel,
				'Hold on! A scene change is already in progress. Please wait.'
			)
			return
		}

		sceneChangeLock.active = true // lock all scene changes

		const numberSet = new Set()
		while (numberSet.size < 6) {
			const randomNumber = Math.floor(Math.random() * 70) + 1
			numberSet.add(randomNumber)
		}
		const lotteryNumbers = Array.from(numberSet)
			.sort((a, b) => a - b)
			.join(', ')

		const message = `${tags.username}'s lucky numbers: ${lotteryNumbers}`

		try {
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName

			// Send a WebSocket message to the proxy server
			const ws = new WebSocket(wsAddress)

			ws.on('open', () => {
				console.log('WebSocket connection opened')
				ws.send('!lotto', message) // Send the trigger message
				ws.close()
			})

			ws.on('error', (error) => {
				console.error('WebSocket error:', error.message)
			})

			await obs.call('SetCurrentProgramScene', {
				sceneName: 'PI CAM',
			})

			console.log(`Switched to PiCam scene: PI CAM`)

			setTimeout(async () => {
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				console.log(`Reverted to previous scene: ${currentSceneName}`)
				sceneChangeLock.active = false // unlock after the scene reverts
			}, 12000)
			client.say(
				channel,
				`Let's check the PiBot for ${tags.username}'s lucky numbers!`
			)
		} catch (error) {
			console.error('Error handling Lotto command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the lottery right now!"
			)
			sceneChangeLock.active = false // unlock if an error occurs
		}
	} else {
		client.say(channel, 'No lottery to show you right now!')
	}
}

module.exports = {
	lottoCommand,
}


