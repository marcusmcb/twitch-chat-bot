const appConfig = require('../../config/appConfig')

const birdcamCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	sceneChangeLock
) => {
	const obsEnabled = appConfig.obs.enabled

	if (obsEnabled) {
		if (sceneChangeLock.active) {
			client.say(
				channel,
				`${tags.username}, somebody beat you to the camera!  Try that command again in a few seconds.`
			)
			return // exit if another scene change is in progress
		}

		sceneChangeLock.active = true // lock all scene changes

		try {
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName

			const randomNumber = Math.floor(Math.random() * 20) + 1
			const sceneName = `BIRDCAM ${randomNumber}`

			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Birdcam scene: ${sceneName}`)

			setTimeout(async () => {
				try {
					await obs.call('SetCurrentProgramScene', {
						sceneName: currentSceneName,
					})
					console.log(`Reverted to previous scene: ${currentSceneName}`)
				} catch (error) {
					console.error('Error reverting Birdcam command:', error.message)
				} finally {
					sceneChangeLock.active = false // unlock after the scene reverts
				}
			}, 8000)

			client.say(channel, 'Check out this recent clip from the birdcam! 🐦')
		} catch (error) {
			console.error('Error handling Birdcam command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the birdcam right now!"
			)
			sceneChangeLock.active = false // unlock if an error occurs
		}
	} else {
		client.say(channel, 'No birds to show you right now!')
	}
}

module.exports = {
	birdcamCommand,
}
