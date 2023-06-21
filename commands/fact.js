const request = require('request')

const factCommand = (channel, tags, args, client) => {
  let randomFact
  let options = {
    url: 'https://uselessfacts.jsph.pl/random.json?language=en',
    headers: { Accept: 'application/json' },
  }
  const callback = async (error, response, body) => {
    if (!error && response.statusCode == 200) {
      randomFact = await JSON.parse(body)
      client.say(channel, `Random fact: ${randomFact.text}`)
    } else {
      client.say(
        channel,
        "Hmmm... looks like that's not working right now. 💀"
      )
    }
  }
  request(options, callback)
}

module.exports = {
  factCommand: factCommand
}