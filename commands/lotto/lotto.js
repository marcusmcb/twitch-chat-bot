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

const lottoCommand = async (channel, tags, args, client, obs) => {
	const numberSet = new Set()
	while (numberSet.size < 6) {
		const randomNumber = Math.floor(Math.random() * 70) + 1
		numberSet.add(randomNumber)
	}
	const lotteryNumbers = Array.from(numberSet)
		.sort((a, b) => a - b)
		.join(', ')

	client.say(
		channel,
		`${tags.username}, check the PiBot for your lucky numbers!`
	)

	let currentScene
	let message = `${tags.username}'s lucky numbers: ${lotteryNumbers}`

	await obs.call('GetSceneList').then((data) => {
		console.log("CURRENT SCENE: ", data.currentProgramSceneName)
		currentScene = data.currentProgramSceneName
	})

	// obs.call('SetInputSettings', {
	// 	inputName: 'obs-chat-response',
	// 	inputSettings: {
	// 		text: `${tags.username}, check the PiBot for your lucky numbers!`,
	// 	},
	// })
	// clearOBSResponse(obs, 5)
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
	}, 20000)
}

module.exports = {
	lottoCommand: lottoCommand,
}
