import Ember from 'ember';

export default Ember.Component.extend({
    // itemsObserver: Ember.observer('entity.shared_to', function(){
    //    debugger 
    // }),
    users: Ember.computed(function(){
        return this.get('store').findAll('user')
    }),
    sortedUsers: Ember.computed('users.content.isLoaded', function(){
        return this.get('users').sortBy('label')
    }),
    actions:{
        clearSharedTo(){
            this.get('entity').rollbackAttributes('shared_to')  
            this.set('open', false)
        },
        saveSharedTo(){
            this.get('entity').save()
            this.set('open', false)
        } 
    }
});
