const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");

dotenv.config();

const url = `https://serato.com/playlists/${process.env.SERATO_DISPLAY_NAME}/live`;

const parseDateAndTime = (timeString, playlistDate) => {
  const date = new Date(playlistDate);
  const [hours, minutes, seconds] = timeString.split(":");
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(parseInt(seconds, 10));
  return date;
};

const convertMilliseconds = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const parseTrackTimestamps = ($, playlistDate) => {
  const results = $("div.playlist-trackname");
  const timestamps = $("div.playlist-tracktime");
  const playlistStartTime = $("span.playlist-start-time").first().text().trim();
  const timestampsParsed = [];
  const trackTimestamps = [];

  for (let j = 0; j < results.length; j++) {
    const timestamp = timestamps[j].children[0].data.trim();
    const timestampParsed = parseDateAndTime(timestamp, playlistDate);
    const timestampIn1970 = new Date(`01/01/1970 ${timestamp}`);
    timestampsParsed.push(timestampParsed);
    trackTimestamps.push(timestampIn1970);
  }

  return { timestampsParsed, trackTimestamps, playlistDate };
};

const calculateTimeDifferences = (trackTimestamps) => {
  const timeDiffs = [];

  for (let k = 0; k < trackTimestamps.length - 1; k++) {
    const timeDiff = trackTimestamps[k + 1] - trackTimestamps[k];
    if (!Number.isNaN(timeDiff)) {
      timeDiffs.push(timeDiff);
    }
  }

  return timeDiffs;
};

const calculateAverageTrackLength = (timeDiffs) => {
  const averageMs =
    timeDiffs.reduce((acc, diff) => acc + diff, 0) / timeDiffs.length;
  const averageTrackLength = convertMilliseconds(averageMs);
  return averageTrackLength;
};

const statsCommand = async (channel, tags, args, client) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const playlistDate = $("span.playlist-start-time").first().text().trim();
    const { timestampsParsed, trackTimestamps } = parseTrackTimestamps(
      $,
      playlistDate
    );
    const timeDiffs = calculateTimeDifferences(trackTimestamps);
    const averageTrackLength = calculateAverageTrackLength(timeDiffs);

    timeDiffs.length === 0
      ? client.say(
          channel,
          "Sorry, no playlist stats for this stream at the moment."
        )
      : client.say(
          channel,
          `${channel.slice(1)} has played ${
            timeDiffs.length
          } songs so far in this stream with an average length of ${averageTrackLength} per song.`
        );
  } catch (err) {
    console.log(err);
    client.say(channel, "That doesn't appear to be working right now.");
  }
};

module.exports = {
  statsCommand: statsCommand,
};
