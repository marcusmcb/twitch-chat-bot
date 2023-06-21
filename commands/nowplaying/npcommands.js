const axios = require('axios')
const cheerio = require('cheerio')
const dotenv = require('dotenv')

dotenv.config()

const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`

const npCommands = (channel, tags, args, client) => {
  const channelName = channel.slice(1).split('#')
  const scrapeSeratoData = async () => {
    try {
      await axios
        .get(url)
        .then(({ data }) => {
          const $ = cheerio.load(data)
          const results = $('div.playlist-trackname')
          const timestamp = $('div.playlist-tracktime')

          // check scrape results to see if they're empty
          // this will occur if the user/streamer isn't sending a live playlist to serato
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
            // let currentTrack = results.last().text()
            client.say(
              channel,
              `${channelName} has played ${results.length} tracks so far in this stream.`
            )
            // axios.post('http://192.168.86.50:8000/display', {
            //   total: new Number(results.length),
            //   current_track: currentTrack.trim()
            // })
            //   .then((response) => {
            //     console.log("Response from Pi: ", response.data)
            //   })
            //   .catch((error) => {
            //     console.log("ERROR: ", error)
            //   })

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
}

const dypCommand = (channel, tags, args, client) => {
  const channelName = channel.slice(1).split('#')
  if (args.length === 0) {
    client.say(
      channel,
      `Add an artist's name after the command to see if ${channelName} has played them yet in this stream.`
    )
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
  }
}

module.exports = {
  npCommands: npCommands,
  dypCommand: dypCommand
}