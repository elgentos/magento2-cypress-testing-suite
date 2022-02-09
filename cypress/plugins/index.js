/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

// For tag support
const tagify = require("cypress-tags");

module.exports = (on, config) => {
    on("file:preprocessor", tagify(config));

    // Run "NODE_ENV=develop; npx cypress run" to run tests locally
    if (process.env.NODE_ENV === "develop") {
        config.baseUrl = "http://cypress.magento2.localhost";
        config.defaultCommandTimeout = 10000; // Sometimes our local envs are slow due to dev mode. Raising the timeout decreases flakyness
    }
    return config;
};
