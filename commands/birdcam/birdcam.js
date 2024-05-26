const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const birdcamCommand = async (channel, tags, args, client, obs) => {
	if (obsEnabled === 'true') {
		let currentScene
		await obs.call('GetSceneList').then((data) => {
			currentScene = data.currentProgramSceneName
		})

		const randomNumber = Math.floor(Math.random() * 20) + 1
		const sceneName = `BIRDCAM ${randomNumber}`

		setTimeout(async () => {
			await obs
				.call('SetCurrentProgramScene', { sceneName: sceneName })
				.then((data) => console.log(data))
		}, 1000)

		setTimeout(() => {
			obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
		}, 8000)

		client.say(channel, 'Check out this recent clip from the birdcam!')
	} else {
		client.say(channel, "Looks like the birdcam command isn't working right now.")
	}
}

module.exports = {
	birdcamCommand: birdcamCommand,
}
