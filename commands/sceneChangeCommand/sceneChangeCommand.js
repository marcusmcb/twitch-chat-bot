// common handler for commands involving scene changes in OBS when enabled
const sceneChangeCommandData = require('./sceneChangeCommandData')
const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES
let sceneChangeLock = false // Lock to prevent multiple scene changes

const sceneChangeCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	command
) => {
	if (obsEnabled === 'true') {
		if (sceneChangeLock) {
			client.say(channel, 'Hold on! A scene change is already in progress.')
			return // Exit if the command is locked
		}

		sceneChangeLock = true // Lock the command

		try {
			// Get the current scene
			const currentSceneData = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentSceneData.currentProgramSceneName

			// Log the current scene for debugging
			console.log(`Current scene: ${currentSceneName}`)

			// Determine the scene name and settings from command data
			const { scene_name, text, error_text, display_time } =
				sceneChangeCommandData[command]

			// Log the target scene for debugging
			console.log(`Switching to scene: ${scene_name}`)

			// Switch to the target scene
			await obs.call('SetCurrentProgramScene', { sceneName: scene_name })
			console.log(`Switched to scene: ${scene_name}`)

			// Notify the chat
			client.say(channel, text)

			// Switch back to the previous scene after `display_time`
			setTimeout(async () => {
				console.log(`Reverting to previous scene: ${currentSceneName}`)
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				sceneChangeLock = false // Unlock the command after reverting
			}, display_time)
		} catch (error) {
			console.error('Error handling Scene Change command:', error.message)
			client.say(channel, `${sceneChangeCommandData[command].error_text}`)
			sceneChangeLock = false // Unlock the command if an error occurs
		}
	} else {
		client.say(channel, `${sceneChangeCommandData[command].error_text}`)
	}
}

module.exports = {
	sceneChangeCommand,
}
