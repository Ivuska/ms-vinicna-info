const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "scpmmm",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    screenshotOnRunFailure:true,
    trashAssetsBeforeRuns:false,
  }
});
