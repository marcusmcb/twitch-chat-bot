const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

let nutsLock = false // lock to prevent re-triggering the command while active

const nutsCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		if (nutsLock) {
			client.say(
				channel,
				'Hold on! The squirrel is already getting a snack. 🐿️'
			)
			return // exit if the command is locked
		}

		nutsLock = true // lock the command

		try {			
			const currentSceneData = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentSceneData.currentProgramSceneName
			// select a random squirrel scene
			const randomNumber = Math.floor(Math.random() * 12) + 1
			const sceneName = `SQUIRREL ${randomNumber}`			
			await obs.call('SetCurrentProgramScene', { sceneName })			
			client.say(channel, "Let's give our buddy a snack! 🐿️")
			
			setTimeout(async () => {
				console.log(`Reverting to previous scene: ${currentSceneName}`)
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				nutsLock = false // unlock the command after reverting
			}, 12000)
		} catch (error) {
			console.error('Error handling Nuts command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble giving the squirrel a snack right now!"
			)
			nutsLock = false // unlock the command if an error occurs
		}
	} else {
		client.say(channel, 'No squirrels to show you right now!')
	}
}

module.exports = {
	nutsCommand,
}
