import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    apiNamespace: Ember.computed('store', function () {
        return this.get('store').adapterFor('application').namespace;
    }),

    sessionService: Ember.inject.service(),
    login: Ember.Object.create(),

    apiHost: Ember.computed('store', function () {
        return this.get('store').adapterFor('application').host;
    }),

    loginObserver: Ember.on('init', Ember.observer('login.username', 'login.password', function () {
        if (!this.get('login.username')) {
            this.set('usernameError', true)
        } else {
            this.set('usernameError', false)
        }

        if (!this.get('login.password')) {
            this.set('passwordError', true)
        } else {
            this.set('passwordError', false)
        }

    })),
    actions: {
        loginWithGoogle() {
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/auth/google',
                type: 'GET',
            }, (response, status) => {
                window.location = response.path
            }, (error, status) => {
            });

        },
        loginWithPassword() {
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/login',
                type: 'POST',
                data: this.get('login')
            }, (response, status) => {
                this.set('loginError', null)
                this.get('sessionService').setToken(response.token);
                this.set('sessionService.authenticated', true);
                this.set('sessionService.permissions', response.permissions);
                this.get('sessionService').setUser(response.user);
                this.set('loading', false);
                let attemptedTransition = this.get('sessionService.getAttemptedTransition')();
                if (attemptedTransition) {
                    window.location.replace(window.location.origin + attemptedTransition);
                } else {
                    this.transitionToRoute('index');
                }
            }, (error, status) => {
                this.set('loginError', "Invalid email/ Password")
            });

        }
    }
});
