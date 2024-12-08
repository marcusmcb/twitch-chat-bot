const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES
let birdcamLock = false // Lock to ensure the command is not re-triggered while active

const birdcamCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		if (birdcamLock) {
			client.say(channel, 'Hold on! The birdcam is already in action. 🐦')
			return // Exit if the command is locked
		}

		birdcamLock = true // Lock the command
		try {
			// Get the current scene
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName

			// Log the current scene for debugging
			console.log(`Current scene: ${currentSceneName}`)

			// Randomly select a Birdcam scene
			const randomNumber = Math.floor(Math.random() * 20) + 1
			const sceneName = `BIRDCAM ${randomNumber}`

			// Log the Birdcam scene for debugging
			console.log(`Switching to Birdcam scene: ${sceneName}`)

			// Switch to Birdcam scene
			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Birdcam scene: ${sceneName}`)

			// Notify chat
			client.say(channel, 'Check out this recent clip from the birdcam! 🐦')

			// Switch back to the previous scene after 8 seconds
			setTimeout(async () => {
				console.log(`Reverting to previous scene: ${currentSceneName}`)
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				birdcamLock = false // Unlock the command after reverting
			}, 8000)
		} catch (error) {
			console.error('Error handling Birdcam command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the birdcam right now!"
			)
			birdcamLock = false // Unlock the command if an error occurs
		}
	} else {
		client.say(channel, 'No birds to show you right now!')
	}
}

module.exports = {
	birdcamCommand,
}
