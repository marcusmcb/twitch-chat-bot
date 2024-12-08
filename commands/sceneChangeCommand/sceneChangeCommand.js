const sceneChangeCommandData = require('./sceneChangeCommandData')
const dotenv = require('dotenv')
dotenv.config()

const sceneChangeCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	command,
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

			const { scene_name, text, error_text, display_time } =
				sceneChangeCommandData[command]

			await obs.call('SetCurrentProgramScene', { sceneName: scene_name })
			console.log(`Switched to scene: ${scene_name}`)
			client.say(channel, text)

			setTimeout(async () => {
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				console.log(`Reverted to previous scene: ${currentSceneName}`)
				sceneChangeLock.active = false // Unlock after the scene reverts
			}, display_time)
		} catch (error) {
			console.error(`Error handling ${command} scene change:`, error.message)
			client.say(channel, sceneChangeCommandData[command].error_text)
			sceneChangeLock.active = false // Unlock on error
		}
	} else {
		client.say(channel, sceneChangeCommandData[command].error_text)
	}
}

module.exports = {
	sceneChangeCommand,
}
