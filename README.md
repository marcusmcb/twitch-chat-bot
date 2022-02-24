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

<hr>

## Commands:

Current channel commands include a Magic 8-Ball game (via the 8ball.js import), random facts (via uselessfacts), and a dad joke generator (via icanhazdadjoke.com).  

Commands are easily modified via the switch casing in index.js but are static for the moment (no ability for moderators to add, modify, etc commands).

<hr>

Marcus McBride, 2022.
