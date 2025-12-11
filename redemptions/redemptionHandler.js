const WebSocket = require('ws')
const dotenv = require('dotenv')
const redemptionData = require('./data/redemptionData.js')

dotenv.config()

const luckyNumberRedemptionHandler = async (obs, client, viewerName, sceneChangeLock) => {
	console.log('Lucky Number Redemption Triggered')
	console.log('--------------------------')
	const wsAddress = process.env.OBS_TCP_ADDRESS	

	// generate the number set and message to send
	// to the RPi server
	const numberSet = new Set()
	while (numberSet.size < 6) {
		const randomNumber = Math.floor(Math.random() * 70) + 1
		numberSet.add(randomNumber)
	}
	const lotteryNumbers = Array.from(numberSet)
		.sort((a, b) => a - b)
		.join(', ')

	const message = `${viewerName}'s lucky numbers: ${lotteryNumbers}`

	console.log(`Generated lucky numbers: ${lotteryNumbers}`)
	console.log('--------------------------')

	try {
		console.log('Connecting to OBS WebSocket...')
		console.log('--------------------------')
		const currentScene = await obs.call('GetCurrentProgramScene')
		const currentSceneName = currentScene.currentProgramSceneName

		// Send a WebSocket message to the proxy server
		const ws = new WebSocket(wsAddress)

		ws.on('open', () => {
			console.log('WebSocket connection opened')
			ws.send('!lotto', message) // Send the trigger message
			ws.close()
		})

		ws.on('error', (error) => {
			console.error('WebSocket error:', error.message)
		})

		await obs.call('SetCurrentProgramScene', {
			sceneName: 'PI CAM',
		})

		console.log(`Switched to PiCam scene: PI CAM`)

		setTimeout(async () => {
			await obs.call('SetCurrentProgramScene', {
				sceneName: currentSceneName,
			})
			console.log(`Reverted to previous scene: ${currentSceneName}`)
			sceneChangeLock.active = false // unlock after the scene reverts
		}, 15000)
	} catch (error) {
		console.error('Error generating lucky numbers:', error.message)
	}
}

const redemptionHandler = async (
	obs,
	client,
	sceneChangeLock,
	channel,
	redemptionTitle,
  viewerName
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
		case 'Shake On It':
			console.log('Redemption: Shake On It')
			redemption = redemptionData.shake_on_it
			break
		case 'Get Your Lucky Numbers':
			console.log('Redemption: Get Your Lucky Numbers')
			redemption = redemptionData.get_your_lucky_numbers
			break
		case "Arizona Sunset":
			console.log('Redemption: Arizona Sunset')
			redemption = redemptionData.arizona_sunset
			break
		case "What's Dash Up To?":
			console.log("Redemption: What's Dash Up To?")
			redemption = redemptionData.whats_dash_up_to
			break
		default:
			console.log('Redemption Claimed:', redemptionTitle)			
			sceneChangeLock.active = false
			return
	}

	try {
		const currentScene = await obs.call('GetCurrentProgramScene')
		const currentSceneName = currentScene.currentProgramSceneName
		if (redemption.scene_name === 'PI CAM') {
			await luckyNumberRedemptionHandler(obs, client, viewerName, sceneChangeLock)
		}
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
