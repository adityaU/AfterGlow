import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route('questions', function () {
        this.route('new');
        this.route('show', {
            path: '/:question_id'
        }, function () {
            this.route('snapshots', function () {
                this.route('show', {
                    path: '/:snapshot_id'
                });
                this.route('all', {
                    path: '/'
                });
            });
        });
        this.route('all', {
            path: '/'
        });
    });

    this.route('dashboards', function () {
        this.route('index', {
            path: '/'
        });
        this.route('show', {
            path: '/:dashboard_id'
        });
    });

    this.route('alerts', function () {
        this.route('index', {
            path: '/'
        });
        this.route('new');
        this.route('edit', {
            path: '/:alert_id/edit'
        });
    });
    this.route('alert_events', function () {
        this.route('index', {
            path: '/'
        });
        this.route('show', {
            path: '/:alert_event_id'
        });
    });
    this.route('login');

    this.route('api', function () {
        this.route('google', function () {
            this.route('callback');
        });
    });
    this.route('settings', function () {
        this.route('databases', function () {
            this.route('index', {
                path: '/'
            });
            this.route('edit', {
                path: '/:database_id/edit'
            });
            this.route('new');
        });

        this.route('email');
        this.route('sms');
        this.route('teams', function () {
            this.route('index', {
                path: '/'
            });
            this.route('edit', {
                path: '/:team_id/edit'
            });
            this.route('new');
        });
        this.route('users', function () {
            this.route('index', {
                path: '/'
            });
            this.route('edit', {
                path: '/:user_id/edit'
            });
            this.route('invite');
        });
        this.route('permissions');
    });

    this.route('tags', function () {
        this.route('show', {
            path: '/:tag_id'
        });
    });
    this.route('loading');

    this.route('data_references', function () {
        this.route('databases', function () {
            this.route('show', {
                path: '/:database_id'
            }, function () {
                this.route('tables', function () {
                    this.route('show', {
                        path: '/:table_id'
                    }, function () {
                        this.route('explore', {
                            path: '/explore'
                        });
                    });
                    this.route('all', {
                        path: '/'
                    });
                });
            });
            this.route('all', {
                path: '/'
            });
        });
    });

    this.route('explore', function () {
        this.route('new', {
            path: '/columns/:column_id/:column_value'
        });
    });
});

export default Router;
