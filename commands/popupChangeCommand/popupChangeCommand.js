const popupChangeCommandData = require('./popupChangeCommandData')
const dotenv = require('dotenv')
dotenv.config()

const popupChangeCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	command,
	popupChangeLock
) => {
	const obsEnabled = process.env.DISPLAY_OBS_MESSAGES
	if (obsEnabled === 'true') {
		if (popupChangeLock.active) {
			client.say(
				channel,
				`${tags.username}, somebody beat you to the popup!  Try that command again in a few seconds.`
			)
			return
		}

		popupChangeLock.active = true

		try {
			let currentScene
			await obs.call('GetCurrentProgramScene').then((data) => {
				currentScene = data.currentProgramSceneName
			})
			let sceneItemId
			await obs
				.call('GetSceneItemList', { sceneName: currentScene })
				.then((data) => {
					const sceneItem = data.sceneItems.find(
						(item) =>
							item.sourceName === popupChangeCommandData[command].source_name
					)
					if (sceneItem) {
						sceneItemId = sceneItem.sceneItemId
					}
				})
			if (sceneItemId) {
				await obs.call('SetSceneItemEnabled', {
					sceneName: currentScene,
					sceneItemId: sceneItemId,
					sceneItemEnabled: true,
				})
				setTimeout(async () => {
					await obs.call('SetSceneItemEnabled', {
						sceneName: currentScene,
						sceneItemId: sceneItemId,
						sceneItemEnabled: false,
					})
					popupChangeLock.active = false
				}, popupChangeCommandData[command].display_time)
			} else {
				client.say(channel, popupChangeCommandData[command].error_text)
				popupChangeLock.active = false
			}
		} catch (error) {
			console.error(`Error handling ${command} popup change:`, error.message)
			client.say(channel, popupChangeCommandData[command].error_text)
			popupChangeLock.active = false
		}
	} else {
		client.say(channel, popupChangeCommandData[command].error_text)
		popupChangeLock.active = false
	}
}

module.exports = {
	popupChangeCommand,
}
