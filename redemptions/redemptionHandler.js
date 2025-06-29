const redemptionData = require('./data/redemptionData.js')

const redemptionHandler = async (
	obs,
	client,
	sceneChangeLock,
  channel,
	redemptionTitle
) => {
	sceneChangeLock.active = true
  let redemptionSceneName = ""

  switch (redemptionTitle) {
    case "Take Us Down PCH":
      console.log("Redemption: Take Us Down PCH")
      redemptionSceneName = "HUNTINGTON TL"
      break
    case "Go Play with Squirrels":
      console.log("Redemption: Go Play with Squirrels")
      break
    default:
      console.log("Unknown redemption title:", redemptionTitle)
      client.say(channel, "Unknown redemption title.")
      sceneChangeLock.active = false
      return
  }





  
	try {
    const currentScene = await obs.call('GetCurrentProgramScene')
    const currentSceneName = currentScene.currentProgramSceneName

  } catch (error) {
    console.error('Error getting current scene:', error.message)
    client.say(channel, "Couldn't retrieve the current scene.")
    sceneChangeLock.active = false
    return
  }
}

module.exports = { redemptionHandler }
