// node dependencies
const tmi = require('tmi.js')
const request = require('request')
const dotenv = require('dotenv')

// import 8ball response array
const eightBallMessages = require('./data/8ball')

dotenv.config()

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: ['djmarcusmcb'],
})

client.connect()

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) {
    return
  }

  const args = message.slice(1).split(' ')
  const command = args.shift().toLowerCase()

  if (command === 'echo') {    
    client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`)
  } else if (command === 'hello') {
    client.say(channel, `@${tags.username}, Yo what's up`)
  } else if (command === 'dice') {
    const result = Math.floor(Math.random() * 6) + 1
    client.say(channel, `@${tags.username}, You rolled a ${result}.`)
  } else if (command === '8ball') {
    // check if user entered anything after the command
    if (args.length != 0) {
      // generate random index
      var random_key = Math.floor(Math.random() * 19 - 0) + 0
      client.say(channel, `@${tags.username}, ${eightBallMessages[random_key]}`)
    } else {
      // if not, generic response to prompt the user to try again
      client.say(channel, `@${tags.username}, what'cha wanna know?`)
    }
  } else if (command === 'dadjoke') {
    let dadJoke
    var headers = { Accept: 'application/json' }
    var options = { url: 'https://icanhazdadjoke.com/', headers: headers }

    const callback = async (error, response, body) => {
      if (!error && response.statusCode == 200) {        
        dadJoke = await JSON.parse(body)
        setTimeout(() => {
          console.log(dadJoke)      
          client.say(channel, `${dadJoke.joke}`)
        }, 1000)
      } else {
        client.say(channel, "Hmmm... looks like that's not working right now.")
      }
    }

    request(options, callback)    
  }
})

// rewrite if logic as switch statement
// add additional 8-ball responses
// looks for other free apis that integrate easily & sound fun
// code callback as proper async function minus the timeout
