# twitch-chat-bot
## Twitch Chat Bot
<hr>

This is a Node script that you can use to respond to chat commands in your Twitch channel.  Channel connectivity is established via the TMI.js library.

You'll need to generate an OAuth token <a href="https://twitchapps.com/tmi/">to link the bot to Twitch via TMI</a>.

If you're looking to create a bot for an existing account, you'll probably want to create a 2nd "bot" account to handle chat commands for the first.
<hr>

## Current dependencies:

* dotenv
* request
* tmi.js 
* axios (optional)
* cheerio (optional)

<hr>

## Commands:

Current channel commands include a Magic 8-Ball game (via the 8ball.js import), random facts (via uselessfacts), and a dad joke generator (via icanhazdadjoke.com).  

Commands are easily modified via the files in the commands directory but are static for the moment (no ability for moderators to add, modify, etc commands).

Current commands:

* !hello 
* !lurk
* !back
* !links
* !714
* !sc
* !prime
* !code
* !dice
* !rock, !paper, !scissors
* !smort
* !faded
* !cratestats

The following commands are for streamers DJing with Serato using the Live Playlists feature.

* !np - returns the current song playing
* !np previous - returns the previous song played
* !np start - returns the 1st song played in the stream
* !np vibecheck - returns a random selection that the streamer played and when they played it
* !np options - displays options for the np command
* !dyp [artist name] - checks the streamer's play history to see if the given artist has been played

<hr>

Marcus McBride, 2022.
