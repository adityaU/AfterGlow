import Ember from 'ember';

export default Ember.Controller.extend({
    sessionService: Ember.inject.service(),
    ajax: Ember.inject.service(),
    init(){
        this._super(...arguments);
        let code = window.location.search.replace("?code=", "")
        this.set('loading', true);
        this.get('ajax').apiCall({
            url: this.get('ajax.apiPath') + '/callback/google/',
            type: 'POST',
            data: {provider: "google", code: code}
        },(response, status)=>{
            this.get('sessionService').setToken(response.token)
            this.set('sessionService.authenticated', true)
            this.set('sessionService.permissions', response.permissions)
            this.get('sessionService').setUser(response.user)
            this.set('loading', false);
            this.transitionToRoute('index')
        },(error, status)=>{
            this.set('loading', false);
            this.set('error', true)
        });
    }
});
