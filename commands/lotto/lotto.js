const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const lottoCommand = async (channel, tags, args, client, obs) => {
	console.log("TAGS: ", tags)
	const numberSet = new Set()
	while (numberSet.size < 6) {
		const randomNumber = Math.floor(Math.random() * 70) + 1
		numberSet.add(randomNumber)
	}
	const lotteryNumbers = Array.from(numberSet)
		.sort((a, b) => a - b)
		.join(', ')	

	if (obsEnabled === 'true') {		
		client.say(
			channel,
			`${tags.username}, check the PiBot for your lucky numbers!`
		)

		let currentScene
		let message = `${tags.username}'s lucky numbers: ${lotteryNumbers}`

		await obs.call('GetSceneList').then((data) => {
			console.log('CURRENT SCENE: ', data.currentProgramSceneName)
			currentScene = data.currentProgramSceneName
		})	

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
				.call('SetCurrentProgramScene', { sceneName: 'PI CAM' })
				.then((data) => console.log(data))
		}, 2000)

		setTimeout(() => {
			obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
		}, 10000)
	} else {
		client.say(
			channel,
			`${tags.username}'s lucky numbers are: ${lotteryNumbers}`
		)
	}
}

module.exports = {
	lottoCommand: lottoCommand,
}
