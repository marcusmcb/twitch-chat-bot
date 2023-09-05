const axios = require('axios')

const clearOBSResponse = (obs, obsClearDisplayTime) => {
	setTimeout(() => {
		obs.call('SetInputSettings', {
			inputName: 'obs-chat-response',
			inputSettings: {
				text: '',
			},
		})
	}, parseInt(obsClearDisplayTime * 1000, 10))
}

const testCommand = async (channel, tags, args, client, obs) => {
	let currentScene

	await obs.call('GetSceneList').then((data) => {
		console.log(data.currentProgramSceneName)
		currentScene = data.currentProgramSceneName
	})

	client.say(channel, 'Your Twitch chat is properly linked to this script!')
	let message = 'Hello from twitch.tv/djmarcusmcb'
	obs.call('SetInputSettings', {
		inputName: 'obs-chat-response',
		inputSettings: {
			text: 'Your test script is connected',
		},
	})
	clearOBSResponse(obs, 5)
	axios
		.post('http://192.168.86.50:8000/display', {
			message: message,
		})
		.then((response) => {
			console.log('Response from Pi: ', response.data)
		})
		.catch((error) => {
			console.log('ERROR: ', error)
		})
	setTimeout(async () => {
		await obs
			.call('SetCurrentProgramScene', { sceneName: 'LIVE VIEW - Main' })
			.then((data) => console.log(data))
	}, 2000)

	setTimeout(() => {
		obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
	}, 15000)
}

module.exports = {
	testCommand: testCommand,
}
