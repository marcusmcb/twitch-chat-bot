const appConfig = require('../../config/appConfig')

const nutsCommand = async (
	channel,
	tags,
	args,
	client,
	obs,
	sceneChangeLock
) => {
	const obsEnabled = appConfig.obs.enabled;

	if (obsEnabled) {
		if (sceneChangeLock.active) {
			client.say(
				channel,
				`${tags.username}, somebody beat you to the camera!  Try that command again in a few seconds.`
			);
			return; // exit if another scene change is in progress
		}

		sceneChangeLock.active = true; // lock all scene changes

		try {
			const currentScene = await obs.call('GetCurrentProgramScene');
			const currentSceneName = currentScene.currentProgramSceneName;

			const randomNumber = Math.floor(Math.random() * 20) + 1;
			const sceneName = `SQUIRREL ${randomNumber}`;

			await obs.call('SetCurrentProgramScene', { sceneName });
			console.log(`Switched to Squirrel scene: ${sceneName}`);

			setTimeout(async () => {
				try {
					await obs.call('SetCurrentProgramScene', {
						sceneName: currentSceneName,
					});
					console.log(`Reverted to previous scene: ${currentSceneName}`);
				} catch (error) {
					console.error('Error reverting Nuts command:', error.message);
				} finally {
					sceneChangeLock.active = false; // unlock after the scene reverts
				}
			}, 12000);

			client.say(channel, "Let's give our buddy a snack! 🐿️");
		} catch (error) {
			console.error('Error handling Nuts command:', error.message);
			client.say(
				channel,
				"Sorry, I'm having trouble giving the squirrel a snack right now!"
			);
			sceneChangeLock.active = false; // unlock if an error occurs
		}
	} else {
		client.say(channel, 'No squirrels to show you right now!');
	}
};

module.exports = {
	nutsCommand,
};
