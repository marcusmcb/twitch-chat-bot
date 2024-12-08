const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES
let nutsLock = false // Lock to prevent re-triggering the command while active

const nutsCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		if (nutsLock) {
			client.say(
				channel,
				'Hold on! The squirrel is already getting a snack. 🐿️'
			)
			return // Exit if the command is locked
		}

		nutsLock = true // Lock the command

		try {
			// Get the current scene
			const currentSceneData = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentSceneData.currentProgramSceneName

			// Log the current scene for debugging
			console.log(`Current scene: ${currentSceneName}`)

			// Randomly select a Squirrel scene
			const randomNumber = Math.floor(Math.random() * 12) + 1
			const sceneName = `SQUIRREL ${randomNumber}`

			// Log the Squirrel scene for debugging
			console.log(`Switching to Squirrel scene: ${sceneName}`)

			// Switch to Squirrel scene
			await obs.call('SetCurrentProgramScene', { sceneName })
			console.log(`Switched to Squirrel scene: ${sceneName}`)

			// Notify chat
			client.say(channel, "Let's give our buddy a snack! 🐿️")

			// Switch back to the previous scene after 12 seconds
			setTimeout(async () => {
				console.log(`Reverting to previous scene: ${currentSceneName}`)
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				nutsLock = false // Unlock the command after reverting
			}, 12000)
		} catch (error) {
			console.error('Error handling Nuts command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble giving the squirrel a snack right now!"
			)
			nutsLock = false // Unlock the command if an error occurs
		}
	} else {
		client.say(channel, 'No squirrels to show you right now!')
	}
}

module.exports = {
	nutsCommand,
}
