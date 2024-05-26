const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const birbCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		let currentScene
		await obs.call('GetCurrentProgramScene').then((data) => {
			currentScene = data.currentProgramSceneName
		})

		// Find the media source item in the current scene
		let sceneItemId
		await obs
			.call('GetSceneItemList', { sceneName: currentScene })
			.then((data) => {
				const sceneItem = data.sceneItems.find(
					(item) => item.sourceName === 'Birdcam1'
				) // Replace 'MediaSourceName' with the actual media source name
				if (sceneItem) {
					sceneItemId = sceneItem.sceneItemId
				}
			})

		if (sceneItemId) {
			// Set the enabled state of the media source to true
			await obs.call('SetSceneItemEnabled', {
				sceneName: currentScene,
				sceneItemId: sceneItemId,
				sceneItemEnabled: true,
			})

			setTimeout(async () => {
				// Set the enabled state of the media source back to false
				await obs.call('SetSceneItemEnabled', {
					sceneName: currentScene,
					sceneItemId: sceneItemId,
					sceneItemEnabled: false,
				})
			}, 5000) // Adjust the duration as needed

			// client.say(channel, 'BIRB IS VISIBLE!')
		} else {
			client.say(channel, 'Media source not found in the current scene.')
		}
	} else {
		client.say(channel, `NO BIRBS FOR YOU, ${tags.username}!`)
	}
}

module.exports = {
	birbCommand: birbCommand,
}
