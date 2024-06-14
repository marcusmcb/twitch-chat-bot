// common handler for commands involving scene changes
// in OBS when enabled

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
	command
) => {
	if (obsEnabled === 'true') {
		let currentScene
		await obs.call('GetSceneList').then((data) => {
			currentScene = data.currentProgramSceneName
		})

		// check typeof scene_name value
		// if array, select a random element from array
		// to return as the scene change in OBS

		const sceneName = sceneChangeCommandData[command].scene_name

		setTimeout(async () => {
			await obs
				.call('SetCurrentProgramScene', { sceneName: sceneName })
				.then((data) => console.log(data))
		}, 1000)

		setTimeout(() => {
			obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
		}, `${sceneChangeCommandData[command].display_time}`)
		client.say(channel, `${sceneChangeCommandData[command].text}`)
	} else {
		client.say(channel, `${sceneChangeCommandData[command].error_text}`)
	}
}

module.exports = {
	sceneChangeCommand: sceneChangeCommand,
}
