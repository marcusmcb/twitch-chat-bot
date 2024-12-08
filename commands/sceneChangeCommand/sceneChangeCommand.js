const sceneChangeCommandData = require('./sceneChangeCommandData')
const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const sceneChangeCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	command,
	commandLocks
) => {
	if (obsEnabled === 'true') {
		if (commandLocks[command]) {
			client.say(
				channel,
				'Hold on! A scene change is already in progress for this command.'
			)
			return // Exit if the command is locked
		}

		commandLocks[command] = true // Lock the command

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
				commandLocks[command] = false // Unlock the command
				console.log(`Reverted to previous scene: ${currentSceneName}`)
			}, display_time)
		} catch (error) {
			console.error(`Error handling ${command} scene change:`, error.message)
			client.say(channel, sceneChangeCommandData[command].error_text)
			commandLocks[command] = false // Unlock the command on error
		}
	} else {
		client.say(channel, sceneChangeCommandData[command].error_text)
	}
}

module.exports = {
	sceneChangeCommand,
}
