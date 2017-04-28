/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'frontend',
        podModulePrefix: 'frontend/pods',
        environment: environment,
        rootURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false
            }
        },
        moment: {
            includeTimezone: 'all'  
        },
        /* pace: {

            // addon-specific options to configure theme
            theme: 'minimal',
            color: 'blue',

            // pace-specific options
            // learn more on http://github.hubspot.com/pace/#configuration
            //           and https://github.com/HubSpot/pace/blob/master/pace.coffee#L1-L72
            catchupTime: 50,
            initialRate: .01,
            minTime: 100,
            ghostTime: 50,
            maxProgressPerFrame: 20,
            easeFactor: 1.25,
            startOnPageLoad: true,
            restartOnPushState: true,
            restartOnRequestAfter: 500,
            target: '.without-header',
            elements: {
                checkInterval: 100,
                selectors: ['body', '.ember-view']
                
            },
            eventLag: {
                minSamples: 10,
                sampleCount: 3,
                lagThreshold: 3
                
            },
            ajax: {
                trackMethods: ['GET','PUT','PATCH','POST', 'DELETE', 'OPTIONS'],
                trackWebSockets: true,
                ignoreURLs: []
            }
            },*/
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        }
    };

    if (environment === 'development') {
        ENV.host = "http://localhost:4000"
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {
        ENV.host = ""

    }

    return ENV;
};
