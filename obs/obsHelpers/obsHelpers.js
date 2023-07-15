const clearOBSResponse = (obs) => {
  setTimeout(() => {
    obs.call("SetInputSettings", {
      inputName: "obs-chat-response",
      inputSettings: {
        text: "",
      },
    });
  }, 5000);
};

module.exports = clearOBSResponse;
