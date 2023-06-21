const request = require('request')

const quoteCommand = (channel, tags, args, client) => {
  let quote, quoter
  let quoteOptions = {
    url: 'https://zenquotes.io/api/random/',
    headers: { Accept: 'application/json' },
  }
  const quoteCallback = async (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let response = await JSON.parse(body)
      quote = response[0].q
      quoter = response[0].a
      client.say(channel, `'${quote}' - ${quoter}`)
    } else {
      client.say(
        channel,
        "Looks like that command isn't working right now."
      )
    }
  }
  request(quoteOptions, quoteCallback)
}

module.exports = {
  quoteCommand: quoteCommand
}