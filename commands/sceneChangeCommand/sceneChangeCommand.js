// common handler for commands involving scene changes
// in OBS when enabled

const sceneChangeCommandData = require('./sceneChangeCommandData')
const dotenv = require('dotenv')
dotenv.config()

const obsEnabled = process.env.DISPLAY_OBS_MESSAGES

const sceneChangeCommand = async (channel, tags, args, client, obs, command) => {  
  console.log("Channel: ", channel)
  console.log("Tags: ", tags)
  console.log("Args: ", args)
  console.log("Command: ", command)
  console.log(sceneChangeCommandData[command].scene_name)
  console.log(sceneChangeCommandData[command].text)
  console.log(sceneChangeCommandData[command].error_text)


  if (obsEnabled === 'true') {
    let currentScene
    await obs.call('GetSceneList').then((data) => {
      currentScene = data.currentProgramSceneName
    })

    const sceneName = sceneChangeCommandData[command].scene_name

    setTimeout(async () => {
      await obs
        .call('SetCurrentProgramScene', { sceneName: sceneName })
        .then((data) => console.log(data))
    }, 1000)

    setTimeout(() => {
      obs.call('SetCurrentProgramScene', { sceneName: `${currentScene}` })
    }, 8000)

    client.say(channel, `${sceneChangeCommandData[command].text}`)
  } else {
    client.say(channel, `${sceneChangeCommandData[command].error_text}`)
  }
}

module.exports = {
  sceneChangeCommand: sceneChangeCommand,
}