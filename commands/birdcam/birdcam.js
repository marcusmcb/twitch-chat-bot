const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

let birdcamLock = false // lock to ensure the command is not re-triggered while active

const birdcamCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		if (birdcamLock) {
			client.say(channel, 'Hold on! The birdcam is already in action. 🐦')
			return // exit if the command is locked
		}

		birdcamLock = true // lock the command

		try {
			const currentScene = await obs.call('GetCurrentProgramScene')
			const currentSceneName = currentScene.currentProgramSceneName
			// randomly select a birdcam scene
			const randomNumber = Math.floor(Math.random() * 20) + 1
			const sceneName = `BIRDCAM ${randomNumber}`
			await obs.call('SetCurrentProgramScene', { sceneName })
			client.say(channel, 'Check out this recent clip from the birdcam! 🐦')

			setTimeout(async () => {
				console.log(`Reverting to previous scene: ${currentSceneName}`)
				await obs.call('SetCurrentProgramScene', {
					sceneName: currentSceneName,
				})
				birdcamLock = false // unlock the command after reverting
			}, 8000)
		} catch (error) {
			console.error('Error handling Birdcam command:', error.message)
			client.say(
				channel,
				"Sorry, I'm having trouble with the birdcam right now!"
			)
			birdcamLock = false // unlock the command if an error occurs
		}
	} else {
		client.say(channel, 'No birds to show you right now!')
	}
}

module.exports = {
	birdcamCommand,
}
