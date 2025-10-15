# twitch-chat-bot
## Twitch Chat Bot
<hr>

This is a Node script that acts as a chat-bot that you can use to respond to chat commands in your connected Twitch channel.  Channel connectivity is established via the TMI.js library.

You'll need to generate an OAuth token <a href="https://twitchapps.com/tmi/">to link the bot to Twitch via TMI</a>.  

Make sure that you're logged into the Twitch account that you want the script to respond from, which will typically be a dedicated chat-bot account for your main channel.
<hr>

## Current dependencies:

* tmi.js
* dotenv 
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

If you wish to display or trigger actions or responses in OBS from your Twitch chat commands, add the following values:

`OBS_WEBSOCKET_ADDRESS='ws://127.0.0.1:4455'`

`OBS_WEBSOCKET_PASSWORD='password'`

<hr>

## Commands:

Commands are defined in command-list/commandList, each imported from files within the /commands directory.

Commands with simple, text-based responses are grouped together for convenience in commands.js.

Commands with additional logic/helpers or API-based responses can each be found in their own directory.

Commands are easily modified via the files in the commands directory but are static for the moment. No ability for moderators to add, modify, etc commands on the fly, but you could update this script to set command use by viewer level (follower, sub, moderator, etc) which can be parsed from each message event.

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

Keep in mind, these are tailored for my own personal use, but can be easily edited for use with commands in any Twitch channel.

### - API/logic response commands ###

* !fact
* !quote
* !dadjoke
* !8ball (question)
* !rock, !paper, !scissors
* !weather (location)

The !weather, !fact, !quote, and !dadjoke commands are all tied to external APIs, some of which may require an API key.  These can easily be stored and referenced in the same ENV file used to handle your Twitch client connection.

<hr>

## Serato Live Playlist Commands ##

I previously included chat commands for use by DJs live-streaming while using Serato Live Playlists.  Those commands and functionality have been moved into a separate repo here on my Github page.

[npChatbot](https://github.com/marcusmcb/serato-nowplaying-twitch)

<hr>

## OBS Integration

This was added to trigger momentary scene changes within OBS while live-streaming using chat commands within this repo.

You can see an example of this in the !birdcam command (/commands/birdcam/birdcam.js). When used, the command triggers a scene change within OBS that displays a randomly selected scene momentarily before returning the view to the previous scene.  

Provided the scene name sent from this script matches one in your OBS configuration, this functionality should be relatively simple to modify for use in your own channel.

Another example can be found in the !birb command (/commands/birb/birb.js).  In this instance, I have an OBS scene with a hidden media source (a video loop) that is momentarily visible on-stream when the command is used before resetting the media source's visibility to hidden.  Like the previous example, this functionality should be easy to modify for your own channel's use.

You can do the same for the text returned from any of the chat commands in this repo by configuring a TextGDI+ element in your OBS and then sending the text response from the command to OBS.  The obs-websocket-js library used to implement this feature has documentation readily available.
<hr>

## Twitch Channel Point Redemptions

This repo also features the necessary Twitch EventSub handlers to listen for and respond to points redemptions that occur in your channel.  In my use case, I have the EventSub handlers in this repo keyed to listen for and respond to redemptions which, in turn, trigger scene changes within my OBS software.  These EventSub handlers can be modified to listen and respond to any channel point redemptions you have configured for your own channel.

## Procfile

The included procfile is for easy deployment and hosting of this chatbot script to Heroku.  Once deployed, be sure to configure Heroku to run this as a worker (not web) script.
<hr>

Marcus McBride, 2025.
