const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const birbCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		let currentScene
		await obs.call('GetCurrentProgramScene').then((data) => {
			currentScene = data.currentProgramSceneName
		})		
		let sceneItemId
		await obs
			.call('GetSceneItemList', { sceneName: currentScene })
			.then((data) => {
				const sceneItem = data.sceneItems.find(
					(item) => item.sourceName === 'Birdcam1'
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
			}, 5000)
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
