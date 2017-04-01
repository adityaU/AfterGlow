import Ember from 'ember';

export default Ember.Component.extend({
    permissionSetsSelected: Ember.computed.alias('user.permission_sets'),
    permissionSetsRemaining: Ember.computed.setDiff('permissionSets', 'permissionSetsSelected'),
    actions:{
        toggleSelectedPermissions(permissionSet){
            let permissionSetsSelected = this.get('permissionSetsSelected');
            if (permissionSetsSelected.indexOf(permissionSet) >=0){
                permissionSetsSelected.removeObject(permissionSet)
            }else{
                permissionSetsSelected.pushObject(permissionSet);
            }
        },
        saveUserPermissions(){
            this.sendAction('saveUserPermissions', this.get('user'))
        }
    }
});
