const birdcamCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	commandLocks
) => {
	const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

	if (obsEnabled === 'true') {
		if (commandLocks.birdcam) {
			client.say(channel, 'Hold on! The birdcam is already running.')
			return // Exit if the command is locked
		}

		commandLocks.birdcam = true // Lock the command

		try {
			// Get the current scene
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName

			// Randomly select a Birdcam scene
			const randomNumber = Math.floor(Math.random() * 20) + 1
			const sceneName = `BIRDCAM ${randomNumber}`

			// Switch to Birdcam scene
			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Birdcam scene: ${sceneName}`)

			setTimeout(async () => {
				// Switch back to the previous scene after 8 seconds
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				commandLocks.birdcam = false // Unlock the command
				console.log(`Reverted to previous scene: ${currentSceneName}`)
			}, 8000)

			client.say(channel, 'Check out this recent clip from the birdcam! 🐦')
		} catch (error) {
			console.error('Error handling Birdcam command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the birdcam right now!"
			)
			commandLocks.birdcam = false // Unlock the command if an error occurs
		}
	} else {
		client.say(channel, 'No birds to show you right now!')
	}
}

module.exports = {
	birdcamCommand,
}
