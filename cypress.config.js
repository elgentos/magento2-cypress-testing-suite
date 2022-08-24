const {defineConfig} = require('cypress');
const tagify = require('cypress-tags');
const fs = require('fs');
const envConfig = fs.existsSync('./cypress.env.json') ? require('./cypress.env.json') : {};

// Run "NODE_ENV=develop; npx cypress run" to run tests locally
const defaultBaseUrl = process.env.NODE_ENV === 'develop' ? 'http://cypress.magento2.localhost' : 'https://example.com/';

// Sometimes our local envs are slow due to dev mode. Raising the timeout decreases flakyness
const defaultCommandTimeout = process.env.NODE_ENV === 'develop' ? 10000 : 4000;

// Customize to use either hyva, luma or custom specs
const defaultSpecPattern = 'cypress/integration/**/*.spec.js';

const baseUrl = process.env.CYPRESS_MAGENTO2_BASE_URL || envConfig.MAGENTO2_BASE_URL || defaultBaseUrl;

module.exports = defineConfig({
    e2e: {
        baseUrl: baseUrl,
        specPattern: process.env.CYPRESS_MAGENTO2_SPEC_PATTERN || envConfig.MAGENTO2_SPEC_PATTERN || defaultSpecPattern,
        excludeSpecPattern: process.env.CYPRESS_MAGENTO2_EXCLUDE_PATTERN || envConfig.MAGENTO2_EXCLUDE_PATTERN || '',
        defaultCommandTimeout: process.env.CYPRESS_MAGENTO2_DEFAULT_TIMEOUT || envConfig.MAGENTO2_DEFAULT_TIMEOUT || defaultCommandTimeout,
        watchForFileChanges: false,
        videoUploadOnPasses: false,
        supportFile: false,
        viewportWidth: 1920,
        viewportHeight: 1080,

        env: {
            mobileViewportWidthBreakpoint: 768,
            mobileViewportWidthBreakpointHyva: 1024
        },

        setupNodeEvents(on, config) {

            on('file:preprocessor', tagify(config))

            return config.specPattern !== 'cypress/integration/**/*.spec.js'
                ? config
                : new Promise((resolve, reject) => {
                    // Do a preflight request to determine which test subset to run depending on the target theme
                    if (baseUrl.startsWith('https')) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
                    const req = (baseUrl.startsWith('https') ? require('https') : require('http')).request(baseUrl);
                    req.on('response', res => {
                        const themeSpecs = res.headers['x-built-with'] === 'Hyva Themes' ? 'hyva' : 'luma'
                        config.specPattern = `cypress/integration/${themeSpecs}/**/*.spec.js`
                        resolve(config);
                    })
                    req.on('error', reject);
                    req.end();
                });
        }
    }
});
