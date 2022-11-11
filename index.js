// node dependencies
const tmi = require('tmi.js')
const request = require('request')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')

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

  // url to scrape for !np & !dyp commands
  const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`

  const runCommand = (command) => {
    switch (command) {
      // test command to verify client connection to twitch chat
      case 'test':
        client.say(
          channel,
          'Your Twitch chat is properly linked to this script!'
        )
        break

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

      // code command
      case 'code':
        client.say(
          channel,
          'Streaming tools for Twitch, Twitter & more: https://github.com/marcusmcb'
        )
        break

      // smort command
      case 'smort':
        let smortValue = Math.floor(Math.random() * 101)
        console.log(smortValue)
        client.say(channel, `@${tags.username} is ${smortValue}% SMORT!`)
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

      // weather command
      case 'weather':
        if (args.length != 0) {
          let weather, userLocation, conditions, temperature
          if (args.length > 1) {
            userLocation = args.join(' ')
          } else {
            userLocation = args
          }
          let weatherOptions = {
            url: `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`,
            headers: { Accept: 'application/json' },
          }
          const weatherCallback = async (error, response, body) => {
            if (!error && response.statusCode == 200) {
              weather = await JSON.parse(body)
              console.log(weather)
              conditions = weather.weather[0].main
              temperature = weather.main.temp.toString()
              temperature = temperature.substring(0, temperature.length - 3)
              client.say(
                channel,
                `Right now in ${userLocation}: ${conditions.toLowerCase()}, ${temperature}F with ${
                  weather.main.humidity
                }% humidity`
              )
            } else {
              console.log(error)
              client.say(
                channel,
                "Looks like that command isn't working right now."
              )
            }
          }
          request(weatherOptions, weatherCallback)
        } else {
          client.say(
            channel,
            `@${tags.username}, add your location after the command to get your weather!`
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

      // dyp (did you play) command
      case 'dyp':
        if (args.length === 0) {
          client.say(
            channel,
            `Add an artist's name after the command to see if ${channelName} has played them yet in this stream.`
          )
          break
        } else {
          const searchSeratoData = async () => {
            try {
              await axios
                .get(url)
                .then(({ data }) => {
                  const $ = cheerio.load(data)
                  const results = $('div.playlist-trackname')
                  // const timestamp = $('div.playlist-tracktime')

                  let tracksPlayed = []

                  // push tracks played so far to array
                  for (let i = 0; i < results.length; i++) {
                    let trackId = results[i].children[0].data.trim()
                    tracksPlayed.push(trackId)
                  }

                  // search array for command option (artist)
                  let searchResults = []
                  let searchTerm = `${args}`.replaceAll(',', ' ')
                  console.log('-------------------------------------')
                  console.log('SEARCH TERM: ', searchTerm)
                  for (let i = 0; i < tracksPlayed.length; i++) {
                    if (
                      tracksPlayed[i]
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      searchResults.push(tracksPlayed[i])
                    }
                  }

                  // dev note - rewrite as proper async/await call
                  setTimeout(() => {
                    if (searchResults.length === 0) {
                      client.say(
                        channel,
                        `${channelName} has not played ${searchTerm} so far in this stream.`
                      )
                    } else if (searchResults.length === 1) {
                      client.say(
                        channel,
                        `${channelName} has played ${searchTerm} ${searchResults.length} time so far in this stream.`
                      )
                    } else if (searchResults.length > 1) {
                      console.log(searchResults)
                      client.say(
                        channel,
                        `${channelName} has played ${searchTerm} ${searchResults.length} times so far in this stream.`
                      )
                    }
                  }, 500)
                })
                .catch((error) => {
                  if (error.response.status === 404) {
                    process.stderr.write('Your Serato URL is incorrect.')
                    client.say(
                      channel,
                      "That doesn't appear to be working right now."
                    )
                  }
                })
            } catch (err) {
              console.log(err)
              // add process.stderr.write statement to handle possible errors
            }
          }
          searchSeratoData()
          break
        }

      // np command
      case 'np':
        const scrapeSeratoData = async () => {
          try {
            await axios
              .get(url)
              .then(({ data }) => {
                const $ = cheerio.load(data)
                const results = $('div.playlist-trackname')
                const timestamp = $('div.playlist-tracktime')

                // check scrape results to see if they're empty
                // this will occur if the user isn't sending a live playlist to serato
                if (results.length === 0) {
                  client.say(
                    channel,
                    "That doesn't seem to be working right now."
                  )

                  // !np (default)
                } else if (args.length === 0) {
                  let nowplaying = results.last().text()
                  client.say(channel, `Now playing: ${nowplaying.trim()}`)

                  // !np previous
                } else if (args == 'previous') {
                  let previousTrack = results[results.length - 2]
                  client.say(
                    channel,
                    `Previous track: ${previousTrack.children[0].data.trim()}`
                  )

                  // !np start
                } else if (args == 'start') {
                  let firstTrack = results.first().text()
                  client.say(
                    channel,
                    `${channelName} kicked off this stream with ${firstTrack.trim()}`
                  )

                  // !np total
                } else if (args == 'total') {
                  client.say(
                    channel,
                    `${channelName} has played ${results.length} tracks so far in this stream.`
                  )

                  // !np vibecheck
                } else if (args == 'vibecheck') {
                  // select random index & parse track and timestamp data from the result
                  let randomIndex = Math.floor(Math.random() * results.length)
                  let randomTrack = results[randomIndex]
                  let randomTrackTimestamp = timestamp[randomIndex]
                  randomTrackTimestamp =
                    randomTrackTimestamp.children[0].data.trim()
                  let currentTrackTimestamp = timestamp.last().text()
                  currentTrackTimestamp = currentTrackTimestamp.trim()

                  // calculate how long ago in the stream the random selection was played
                  // date strings are "fudged" for formatting purposes to easily make the time calculation
                  let x = new Date(`Jan 1, 2022 ${currentTrackTimestamp}`)
                  let y = new Date(`Jan 1, 2022 ${randomTrackTimestamp}`)
                  let res = Math.abs(x - y) / 1000
                  let hours = Math.floor(res / 3600) % 24
                  let minutes = Math.floor(res / 60) % 60
                  let seconds = res % 60

                  // if random index timestamp has an hours value
                  if (hours > 0) {
                    // if that hours value is > 1
                    if (hours > 1) {
                      client.say(
                        channel,
                        `${channelName} played "${randomTrack.children[0].data.trim()}" ${hours} hours & ${minutes} minutes ago in this stream.`
                      )
                    } else {
                      client.say(
                        channel,
                        `${channelName} played "${randomTrack.children[0].data.trim()}" ${hours} hour & ${minutes} minutes ago in this stream.`
                      )
                    }
                  } else {
                    client.say(
                      channel,
                      `${channelName} played "${randomTrack.children[0].data.trim()}" ${minutes} minutes ago in this stream.`
                    )
                  }

                  // !np options
                } else if (args == 'options') {
                  client.say(
                    channel,
                    'Command Options: !np (current song), !np start (first song), !np previous (previous song), !np vibecheck (try it & find out)'
                  )
                  // default catch-all for any args passed that are not defined
                } else {
                  client.say(
                    channel,
                    'Command Options: !np (current song), !np start (first song), !np previous (previous song), !np vibecheck (random song we already played)'
                  )
                }
              })
              .catch((error) => {
                // expand error checking here as needed (currently working for Serato errors)
                console.log(error)
                client.say(
                  channel,
                  "That doesn't appear to be working right now."
                )
              })
          } catch (err) {
            console.log(err)
            // add process.stderr.write statement to handle possible errors
          }
        }
        scrapeSeratoData()
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
    'test',
    'dyp',
    'np',
    'weather',
    'smort',
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
// move !np options to start of logic switch (returning error w/o a live playlist currently)

// add function for bot to post specific commands at set intervals
// check "self" condition in message and add logic accordingly
