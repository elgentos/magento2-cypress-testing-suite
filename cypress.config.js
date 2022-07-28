const {defineConfig} = require('cypress');
const tagify = require("cypress-tags");
const { existsSync } = require('fs');
const envConfig = existsSync('./cypress.env.json') ? require('./cypress.env.json') : {};

// Run "NODE_ENV=develop; npx cypress run" to run tests locally
const baseUrl = process.env.NODE_ENV === "develop" ? "http://cypress.magento2.localhost" : "https://example.com/";

// Sometimes our local envs are slow due to dev mode. Raising the timeout decreases flakyness
const defaultCommandTimeout = process.env.NODE_ENV === "develop" ? 10000 : 4000;

module.exports = defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_MAGENTO2_BASE_URL || envConfig.MAGENTO2_BASE_URL || baseUrl,
        specPattern: process.env.CYPRESS_MAGENTO2_SPEC_PATTERN || envConfig.MAGENTO2_SPEC_PATTERN ||'cypress/integration/hyva/**/*.spec.js',
        excludeSpecPattern: process.env.CYPRESS_MAGENTO2_EXCLUDE_PATTERN || envConfig.MAGENTO2_EXCLUDE_PATTERN || '',
        defaultCommandTimeout: process.env.CYPRESS_MAGENTO2_DEFAULT_TIMEOUT || envConfig.MAGENTO2_DEFAULT_TIMEOUT || defaultCommandTimeout,
        watchForFileChanges: false,
        supportFile: false,
        viewportWidth: 1920,
        viewportHeight: 1080,

        env: {
            mobileViewportWidthBreakpoint: 768,
            mobileViewportWidthBreakpointHyva: 1024
        },

        setupNodeEvents(on, config) {
            on('file:preprocessor', tagify(config))
        }
    }
});
