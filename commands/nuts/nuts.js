const nutsCommand = async (
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

			const randomNumber = Math.floor(Math.random() * 12) + 1
			const sceneName = `SQUIRREL ${randomNumber}`

			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Squirrel scene: ${sceneName}`)

			setTimeout(async () => {
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				console.log(`Reverted to previous scene: ${currentSceneName}`)
				sceneChangeLock.active = false // Unlock after the scene reverts
			}, 12000)

			client.say(channel, "Let's give our buddy a snack! 🐿️")
		} catch (error) {
			console.error('Error handling Nuts command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble giving the squirrel a snack right now!"
			)
			sceneChangeLock.active = false // Unlock if an error occurs
		}
	} else {
		client.say(channel, 'No squirrels to show you right now!')
	}
}

module.exports = {
	nutsCommand,
}
