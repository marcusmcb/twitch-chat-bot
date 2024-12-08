const dotenv = require('dotenv')
dotenv.config()

const birdcamCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	sceneChangeLock
) => {
	const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

	if (obsEnabled === 'true') {
		if (sceneChangeLock.active) {
			client.say(
				channel,
				'Hold on! A scene change is already in progress. Please wait.'
			)
			return // Exit if another scene change is in progress
		}

		sceneChangeLock.active = true // Lock all scene changes

		try {
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName

			const randomNumber = Math.floor(Math.random() * 20) + 1
			const sceneName = `BIRDCAM ${randomNumber}`

			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Birdcam scene: ${sceneName}`)

			setTimeout(async () => {
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				console.log(`Reverted to previous scene: ${currentSceneName}`)
				sceneChangeLock.active = false // Unlock after the scene reverts
			}, 8000)

			client.say(channel, 'Check out this recent clip from the birdcam! 🐦')
		} catch (error) {
			console.error('Error handling Birdcam command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the birdcam right now!"
			)
			sceneChangeLock.active = false // Unlock if an error occurs
		}
	} else {
		client.say(channel, 'No birds to show you right now!')
	}
}

module.exports = {
	birdcamCommand,
}
