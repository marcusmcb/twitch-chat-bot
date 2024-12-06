const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const nutsCommand = async (channel, tags, args, client, obs) => {
  if (obsEnabled === 'true') {
    let currentScene
    await obs.call('GetSceneList').then((data) => {
      currentScene = data.currentProgramSceneName
    })

    const randomNumber = Math.floor(Math.random() * 12) + 1
    const sceneName = `SQUIRREL ${randomNumber}`

    setTimeout(async () => {
      await obs
        .call('SetCurrentProgramScene', { sceneName: sceneName })
        .then((data) => console.log(data))
    }, 1000)

    setTimeout(() => {
      obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
    }, 12000)

    client.say(channel, "Let's give our buddy a snack! 🐿️")
  } else {
    client.say(channel, "No squirrels to show you right now!")
  }
}

module.exports = {
  nutsCommand: nutsCommand,
}