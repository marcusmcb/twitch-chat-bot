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
	console.log("Scene change command called")
	console.log("Command: ", command)
	if (obsEnabled === 'true') {
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
				sceneChangeLock.active = false // unlock after the scene reverts
			}, display_time)
		} catch (error) {
			console.error(`Error handling ${command} scene change:`, error.message)
			client.say(channel, sceneChangeCommandData[command].error_text)
			sceneChangeLock.active = false // unlock on error
		}
	} else {
		client.say(channel, sceneChangeCommandData[command].error_text)
	}
}

module.exports = {
	sceneChangeCommand,
}
