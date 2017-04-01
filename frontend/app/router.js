import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('questions', function() {
        this.route('new');
        this.route('show', {path: '/:question_id'});
        this.route('all');
    });

    this.route('dashboards', function() {
        this.route('show', {path: '/:dashboard_id'});
    });

    this.route('alerts', function() {
        this.route('new');
        this.route('show');
    });
    this.route('login');

    this.route('api', function() {
        this.route('google', function() {
            this.route('callback');
        });
    });
    this.route('settings', function() {
        this.route('databases', function() {
            this.route('index', {path: '/'});
            this.route('new');
        });

        this.route('email');
        this.route('sms');
        this.route('pagerduty');
        this.route('users');
        this.route('permissions');
    });
});

export default Router;
