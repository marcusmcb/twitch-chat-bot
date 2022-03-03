// node dependencies
const tmi = require('tmi.js')
const request = require('request')
const dotenv = require('dotenv')

// import 8ball response array
const eightBallMessages = require('./data/8ball')

// secure twitch oauth token for tmi
dotenv.config()

// create tmi instance
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

// chat command listener
client.on('message', (channel, tags, message, self) => {
  console.log('MESSAGE: ', message)
  if (self || !message.startsWith('!')) {
    return
  }

  const args = message.slice(1).split(' ')
  const command = args.shift().toLowerCase()
  const channelName = channel.slice(1).split('#')

  switch (command) {
    // hello command
    case 'hello':
      client.say(channel, `@${tags.username}, what's good homie! 👋👋👋`)
      break

    // lurk command
    case 'lurk':
      client.say(
        channel,
        `@${tags.username} is gonna be over there, doin' whatever...`
      )
      break

    // back command
    case 'back':
      client.say(channel, `Lurk no more... @${tags.username} has returned!`)
      break

    // dice command
    case 'dice':
      const result = Math.floor(Math.random() * 6) + 1
      client.say(channel, `@${tags.username}, you rolled a ${result}. 🎲🎲🎲`)
      break

    // links command
    case 'links':
      client.say(
        channel,
        `You can find all of my socials & links @ http://www.djmarcusmcbride.com`
      )
      break

    // 714 command
    case '714':
      client.say(
        channel,
        `${channelName} is coming to you live from the front of the crib in Orange County, CA! 🍊`
      )
      break

    // sc (soundcloud) command
    case 'sc':
      client.say(
        channel,
        `You can check out MarcusMCB's Soundcloud page over @ https://soundcloud.com/marcusmcbride.`
      )
      break

    case 'prime':
      client.say(
        channel,
        'Got Amazon Prime? Subscribe to the channel for free! https://subs.twitch.tv/djmarcusmcb'
      )
      break

    case 'host':
      client.say(
        channel,
        `If you're diggin' the vibe, feel free to host and share! https://twitch.tv/djmarcusmcb ✌️🌴`
      )
      break

    // 8ball command
    case '8ball':
      // check if user entered anything after the command
      if (args.length != 0) {
        var random_key = Math.floor(Math.random() * 19 - 0) + 0
        client.say(
          channel,
          `@${tags.username}, ${eightBallMessages[random_key]}`
        )
      } else {
        // if not, prompt the user to try again
        client.say(
          channel,
          `@${tags.username}, what'cha wanna know? Ask a question after the command! 🎱`
        )
      }
      break

    // dadjoke command
    case 'dadjoke':
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
      break

    // fact command
    case 'fact':
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
      break

    // no response as default for commands that don't exist
    default:
      break
  }
})

// add additional 8-ball responses
// looks for other free apis that integrate easily & sound fun
// replace request with another npm method per request's discontinuation
// refactor code to helper method for each api fetch case
// * await request within async func?
// * rpi4 performance?

// heroku deploy?
