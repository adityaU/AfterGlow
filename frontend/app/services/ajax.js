import Ember from 'ember';

export default Ember.Service.extend({

    apiCall(options,successCb,failureCb) {
        options && options.data && (options.data = JSON.stringify(options.data))
        options.beforeSend= function(request) {
            request.setRequestHeader("Content-type", 'application/json');
              
        }
        Ember.$.ajax(options)
            .then((response,status)=>{
                if(successCb) {
                    successCb(response,status);
                }
            })
            .catch((error,status)=>{
                if((error.status && error.status == 401)) {
                    window.location.href = "/logout";
                }
                if(failureCb) {
                    failureCb(error.responseJSON,status);
                }
            })
    }

});
