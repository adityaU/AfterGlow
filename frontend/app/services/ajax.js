import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service(),
    sessionService: Ember.inject.service(),
    
    apiNamespace: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').namespace;
    }),

    apiHost: Ember.computed('store', function(){
        return this.get('store').adapterFor('application').host;
    }),

    apiPath: Ember.computed(function(){
        return this.get('apiHost') + this.get('apiNamespace') ;
    }),

    apiCall(options,successCb,failureCb) {
        options && options.data && (options.data = JSON.stringify(options.data))
        options.beforeSend= (request) =>{
            request.setRequestHeader("Content-type", 'application/json');
            request.setRequestHeader("Authorization", this.get('sessionService.token'));
              
        }
        Ember.$.ajax(options)
            .then((response,status)=>{
                if(successCb) {
                    successCb(response,status);
                }
            })
            .catch((error,status)=>{
                if(failureCb) {
                    failureCb(error.responseJSON,status);
                }
            })
    }

});
