const axios = require('axios')

const testCommand = (channel, tags, args, client) => {
  client.say(
    channel,
    'Your Twitch chat is properly linked to this script!'
  )
  let message = "Hello from twitch.tv/djmarcusmcb"
  axios.post('http://192.168.86.50:8000/display', {
    message: message
  })
    .then((response) => {
      console.log("Response from Pi: ", response.data)
    })
    .catch((error) => {
      console.log("ERROR: ", error)
    })
}

module.exports = {
  testCommand: testCommand
}