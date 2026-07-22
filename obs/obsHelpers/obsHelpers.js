const appConfig = require('../../config/appConfig')

const clearOBSResponse = (obs) => {
  setTimeout(() => {
    obs.call("SetInputSettings", {
      inputName: "obs-chat-response",
      inputSettings: {
        text: "",
      },
    });
  }, appConfig.obs.displayDuration);
};

module.exports = clearOBSResponse;
