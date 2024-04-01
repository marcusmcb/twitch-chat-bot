const birdcamCommand = async (channel, tags, args, client, obs) => {
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
}

module.exports = {
	birdcamCommand: birdcamCommand,
}
