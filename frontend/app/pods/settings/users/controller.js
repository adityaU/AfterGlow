import Ember from 'ember';

export default Ember.Controller.extend({
    users: Ember.computed.alias('model'),
    permissionSets: Ember.computed(function(){
        return this.store.findAll('permission-set') 
    }),
    actions: {
        showChangePermissionDialogue(user){
            this.set('toBeChangedUser', user);
            $('.ui.modal.change-user-permissions').modal('show')
        },
        saveUser(user){
            user.save().then((user)=>{
            })
        },
        
    }
});
