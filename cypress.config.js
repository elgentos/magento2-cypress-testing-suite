const {defineConfig} = require('cypress');
const {tagify} = require('cypress-tags');
const fs = require('fs');
const envConfig = fs.existsSync('./cypress.env.json') ? require('./cypress.env.json') : {};

// Run "NODE_ENV=develop npx cypress run" to run tests locally
const defaultBaseUrl = process.env.NODE_ENV === 'develop' ? 'http://cypress.magento2.localhost' : 'https://example.com/';

// Sometimes our local envs are slow due to dev mode. Raising the timeout decreases flakiness
const defaultCommandTimeout = process.env.NODE_ENV === 'develop' ? 10000 : 4000;

// Customize to use either hyva, luma or custom specs
const defaultSpecPattern = [
    'cypress/integration/$SPEC_SUITE/**/*.spec.js',
    'app/code/**/Test/Cypress/$SPEC_SUITE/**/*.spec.js',
    'vendor/**/Test/Cypress/$SPEC_SUITE/**/*.spec.js',
];

const baseUrl = process.env.CYPRESS_MAGENTO2_BASE_URL || envConfig.MAGENTO2_BASE_URL || defaultBaseUrl;

module.exports = defineConfig({
    projectId: "8vuidn",
    e2e: {
        baseUrl: baseUrl,
        specPattern: process.env.CYPRESS_MAGENTO2_SPEC_PATTERN || envConfig.MAGENTO2_SPEC_PATTERN || defaultSpecPattern,
        specSuite: process.env.CYPRESS_MAGENTO2_SPEC_SUITE || envConfig.MAGENTO2_SPEC_SUITE || undefined,
        excludeSpecPattern: process.env.CYPRESS_MAGENTO2_EXCLUDE_PATTERN || envConfig.MAGENTO2_EXCLUDE_PATTERN || '',
        defaultCommandTimeout: parseInt(process.env.CYPRESS_MAGENTO2_DEFAULT_TIMEOUT || envConfig.MAGENTO2_DEFAULT_TIMEOUT || defaultCommandTimeout),
        watchForFileChanges: false,
        supportFile: 'cypress/support/index.js',
        viewportWidth: 1920,
        viewportHeight: 1080,

        env: {
            mobileViewportWidthBreakpoint: 768,
            mobileViewportWidthBreakpointHyva: 1024
        },

        setupNodeEvents(on, config) {

            on('after:spec', (spec, results) => {
                // If a retry failed, save the video, otherwise delete it to save time by not compressing it.
                if (results && results.video) {
                    // Do we have failures for any retry attempts?
                    const failures = results.tests.find(test => {
                        return test.attempts.find(attempt => {
                            return attempt.state === 'failed'
                        })
                    });
                    // Delete the video if the spec passed on all attempts
                    if (!failures) {
                        fs.existsSync(results.video) && fs.unlinkSync(results.video)
                    }
                }
            })

            on('file:preprocessor', tagify(config))

            on('task', {
                axetable(message) {
                    console.table(message, ['impact', 'description', 'nodes'] );
                    console.log("Details")
                    console.log(message.map(m => `"${m.id}:" \n ${m.html}`).join('\n\n'));
                    return null;
                },
            });

            const applySpecSuiteToSpecPattern = (config) => {
                // If the specSuite is an empty string, add a trailing / to $SPEC_SUITE to avoid // in the pattern
                const regex = config.specSuite === '' ? /\$SPEC_SUITE\//g : /\$SPEC_SUITE/g;
                const fn = (specPattern) => specPattern.replace(regex, config.specSuite)
                config.specPattern = typeof config.specPattern === 'string' ? fn(config.specPattern) : config.specPattern.map(fn);
                return config;
            }

            return config.specSuite === undefined
                ? new Promise((resolve, reject) => {
                    // Do a preflight request to determine which frontend test suite to run depending on the target theme
                    if (baseUrl.startsWith('https')) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
                    const req = (baseUrl.startsWith('https') ? require('https') : require('http')).request(baseUrl);
                    req.on('response', res => {
                        config.specSuite = res.headers['x-built-with'] === 'Hyva Themes' ? 'hyva' : 'luma'
                        resolve(applySpecSuiteToSpecPattern(config));
                    })
                    req.on('error', reject);
                    req.end();
                })
                : applySpecSuiteToSpecPattern(config);
        }
    }
});
