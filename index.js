// node dependencies
const tmi = require('tmi.js')
const request = require('request')
const dotenv = require('dotenv')

// import 8ball response array
const eightBallMessages = require('./8ball/8ball')

// secure twitch oauth token for tmi
dotenv.config()

// global vars to track and prevent command spamming
let lastCommand
let lastUser
let commandCount = 0

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
  channels: [process.env.TWITCH_CHANNEL_NAME],
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

  const runCommand = (command) => {
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

      // faded command
      case 'faded':
        const fadedResult = Math.floor(Math.random() * 100) + 1
        client.say(
          channel,
          `@${tags.username} is ${fadedResult}% faded right now.`
        )
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

      // prime command
      case 'prime':
        client.say(
          channel,
          `Got Amazon Prime? Subscribe to the channel for free! https://subs.twitch.tv/${channelName}`
        )
        break

      // host command
      case 'host':
        client.say(
          channel,
          `If you're diggin' the vibe, feel free to host and share! https://twitch.tv/${channelName} ✌️🌴`
        )
        break

      // code command
      case 'code':
        client.say(
          channel,
          'Streaming tools for Twitch, Twitter & more: https://github.com/marcusmcb'
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
  }

  // user is limited to 6 consecutive uses of each command
  // beyond that cap, user is prompted to use another command
  const rateLimited = () => {
    client.say(
      channel,
      `${tags.username}, try a different command before using that one again.`
    )
  }

  // master list of current commands in this script for our client connection to listen for
  // any commands added/updated above need to be added/updated here
  const commandList = [
    'hello',
    'lurk',
    'back',
    'faded',
    'dice',
    'links',
    '714',
    'sc',
    'prime',
    'host',
    'code',
    '8ball',
    'dadjoke',
    'fact',
  ]
  // check if command is in list
  if (commandList.includes(command)) {
    // check if the same user has entered the same command consecutively more than once
    if (lastCommand == command && lastUser == tags.username) {
      console.log(true)
      commandCount++
      console.log('COMMAND COUNT: ', commandCount)
      // redirect user to another command on rate limit
      if (commandCount === 6) {
        rateLimited()
        // ignore further commands from user if spamming
      } else if (commandCount > 6) {
        return
        // run command otherwise
      } else {
        runCommand(command)
      }
      // if not, call method/function that runs switch selector, set vars and counter
    } else {
      console.log(false)
      lastCommand = command
      lastUser = tags.username
      commandCount = 1
      runCommand(command)
    }
  } else {
    // if command is not in list, reset count and return w/o response
    // we only want this script to listen for commands within the commandList
    // prevents response and rate-limiting conflicts w/other bots configured for the same channel
    commandCount = 0
    // reset args
    return
  }
})

// add additional 8-ball responses
// looks for other free apis that integrate easily & sound fun
// replace request with another npm method per request's discontinuation
// refactor code to helper method for each api fetch case
// * await request within async func?
// * rpi4 performance?

// add command to check to see if another streamer is currently live (common question)
