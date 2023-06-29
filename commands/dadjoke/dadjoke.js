const request = require('request')

const dadjokeCommand = (channel, tags, args, client) => {
  let dadJoke
  let jokeOptions = {
    url: 'https://icanhazdadjoke.com/',
    headers: { Accept: 'application/json' },
  }
  const jokeCallback = async (error, response, body) => {
    if (!error && response.statusCode == 200) {
      dadJoke = await JSON.parse(body)
      client.say(channel, `${dadJoke.joke}`)
    } else {
      client.say(
        channel,
        "Hmmm... looks like that's not working right now. 💀"
      )
    }
  }
  request(jokeOptions, jokeCallback)
}

module.exports = {
  dadjokeCommand: dadjokeCommand
}