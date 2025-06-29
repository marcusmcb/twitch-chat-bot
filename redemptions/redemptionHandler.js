const redemptionData = require('./data/redemptionData.js')

const redemptionHandler = async (
	obs,
	client,
	sceneChangeLock,
	channel,
	redemptionTitle
) => {
	sceneChangeLock.active = true

	let redemption  

	switch (redemptionTitle) {
		case 'Take Us Down PCH':
			console.log('Redemption: Take Us Down PCH')
			redemption = redemptionData.take_us_down_pch
			break
		case 'Go Play With Squirrels':
			console.log('Redemption: Go Play with Squirrels')
			redemption = redemptionData.go_play_with_squirrels
			break
		case 'Sunset Time':
			console.log('Redemption: Sunset Time')
			redemption = redemptionData.sunset_time
			break
		case 'Water Those Dogs':
			console.log('Redemption: Water Those Dogs')
			redemption = redemptionData.water_those_dogs
			break
		default:
			console.log('Unknown redemption title:', redemptionTitle)
			client.say(channel, 'Unknown redemption title.')
			sceneChangeLock.active = false
			return
	}

	try {
		const currentScene = await obs.call('GetCurrentProgramScene')
		const currentSceneName = currentScene.currentProgramSceneName
		await obs.call('SetCurrentProgramScene', {
			sceneName: redemption.scene_name,
		})
		client.say(channel, redemption.text)
		setTimeout(async () => {
			await obs.call('SetCurrentProgramScene', { sceneName: currentSceneName })
			console.log(`Reverted to previous scene: ${currentSceneName}`)
			sceneChangeLock.active = false
		}, redemption.display_time)
	} catch (error) {
		console.error('Error getting current scene:', error.message)
		client.say(channel, "I couldn't find the scene for that redemption.")
		sceneChangeLock.active = false
		return
	}
}

module.exports = { redemptionHandler }
