import Ember from 'ember';


export default Ember.Mixin.create({
    
    sessionService: Ember.inject.service(),
    beforeModel(){
        this._super(...arguments);
        if (!this.get('sessionService.authenticated')){
            return new Ember.RSVP.Promise((resolve, reject)=>{
                this.get('sessionService').verifyToken((response, status)=>{
                    resolve(response)
                }, (error, status)=>{
                    debugger
                    this.transitionTo('login')
                    reject(error)
                })
            })
        }
    }

})
