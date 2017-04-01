import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    apiNamespace: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').namespace;
    }),

    apiHost: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').host;
    }),
    actions: {
        loginWithGoogle(){
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/auth/google',
                type: 'GET',
            },(response, status)=>{
                window.location = response.path
            },(error, status)=>{
            });
            
        }
    }
});
