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
* obs-websocket-js (optional)

<hr>

## Credentials:

Create a .env file in the root directory of this repo with the following values:

`TWITCH_OAUTH_TOKEN='oauth_token_value'`

`TWITCH_BOT_USERNAME='chatbot_username'`

`TWITCH_CHANNEL_NAME='twitch_username'`

<hr>

If you wish to use the np/stats commands for DJ streams, you'll need to add your Serato.com profile display name.

`SERATO_DISPLAY_NAME='DJ_Name_Goes_Here'`

<hr>

If you wish to display the np/stats commands on screen in OBS, add the following values:

`OBS_WEBSOCKET_ADDRESS='ws://127.0.0.1:4455'`

`OBS_WEBSOCKET_PASSWORD='password'`

<hr>

## Commands:

Commands are defined in command-list/commandList, each imported from files within the /commands directory.

Commands with simple, text-based responses are grouped together for convenience in commands.js.

Commands with additional logic/helpers or API-based responses can each be found in their own directory.

Commands are easily modified via the files in the commands directory but are static for the moment (no ability for moderators to add, modify, etc commands).

<hr>

## Current commands:

### - text-response commands ###

* !hello 
* !lurk
* !back
* !links
* !714
* !sc
* !prime
* !code
* !dice
* !smort
* !faded
* !cratestats

Keep in mind, these are tailored for my own personal use, but can be easily edited for use with commands in any Twitch channel.

### - API/logic response commands ###

* !fact
* !quote
* !dadjoke
* !8ball (question)
* !rock, !paper, !scissors
* !weather (location)

<hr>

## Serato Live Playlist Commands ##

The following commands are for streamers DJing with Serato using the Live Playlists feature.

To use this feature, you will need to have Serato's Live Playlist feature enabled and running while DJing.  The link below provides further detail on how to enable this feature.  

[Live Playlists](https://support.serato.com/hc/en-us/articles/228019568-Live-Playlists#:~:text=To%20enable%20the%20Live%20Playlists,stop%20your%20Live%20Playlist%20session.)

<hr>

### -- IMPORTANT --

Once running, make sure that your Serato Live Playlist is set to public; they're set to private by default when created.  If set to private, the commands below will not available to stream viewers.

<hr>

### - np (now playing) commands ###

* !np - returns the current song playing
* !np previous - returns the previous song played
* !np start - returns the 1st song played in the stream
* !np vibecheck - returns a random selection that the streamer played and when they played it
* !np options - displays options for the np command
* !dyp [artist name] - checks the streamer's play history to see if the given artist has been played

### - stats commands ###
* !stats - returns the total tracks played and the average track length
* !shortestsong - returns the shortest song played in the set thus far
* !longestsong - returns the longest song played in the set thus far
* !doubles - checks if the streamer has played doubles (same song on both decks) at any point during the set

<hr>

## OBS Integration

The stats and np commands above all have OBS integration to display their responses on-screen during a user's live stream.  Connection is established and text data is updated via the obs-websocket-js library.

If you wish to display these responses during a live stream, you'll need a TextGDI+ element named obs-chat-response configured as a source within your OBS stream.

The bot response updates just the TextGDI+ element's text but none of the corresponding properties (font, color, etc) so you'll need to determine how to best style the response and it's placement on screen.

If you're not using OBS or don't wish to display the responses on screen, the bot responses will still appear as text in the Twitch chat, with the script disregarding the OBS response if a socket connection cannot be established.

<hr>

Marcus McBride, 2022.
