const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  e2e: {
    baseUrl: "http://3.13.86.142:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
});
