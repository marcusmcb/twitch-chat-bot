const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const fortuneCommand = async (channel, tags, args, client, obs) => {
	let fortuneOptions = {
		url: 'https://aphorismcookie.herokuapp.com',
		headers: { Accept: 'application/json' },
	}

	try {
		const response = await axios(fortuneOptions)
		if (response.data.meta.status === 200) {
			client.say(channel, `${response.data.data.message}`)
			// if (obsEnabled === 'true') {
			// 	client.say(
			// 		channel,
			// 		`${tags.username}, check the PiBot for your fortune!`
			// 	)

			// 	let currentScene
			// 	let message = response.data.data.message

			// 	await obs.call('GetSceneList').then((data) => {
			// 		console.log('CURRENT SCENE: ', data.currentProgramSceneName)
			// 		currentScene = data.currentProgramSceneName
			// 	})

			// 	axios
			// 		.post('http://192.168.86.50:5000/display_fortune', {
			// 			message: message,
			// 		})
			// 		.then((response) => {
			// 			console.log('Response from Pi: ', response.data)
			// 		})
			// 		.catch((error) => {
			// 			console.log('ERROR: ', error)
			// 		})
			// 	setTimeout(async () => {
			// 		await obs
			// 			.call('SetCurrentProgramScene', { sceneName: 'PI CAM' })
			// 			.then((data) => console.log(data))
			// 	}, 2000)

			// 	setTimeout(() => {
			// 		obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
			// 	}, 12000)
			// } else {
			// 	client.say(channel, `${response.data.data.message}`)
			// }
		} else {
			client.say(
				channel,
				"Hmmm... looks like fortunes aren't working right now. 💀"
			)
		}
	} catch (error) {
		console.log('ERROR: ', error)
		client.say(channel, "Hmmm... looks like that's not working right now. 💀")
	}
}

module.exports = {
	fortuneCommand: fortuneCommand,
}
