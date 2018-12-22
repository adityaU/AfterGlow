import Ember from 'ember';

export default Ember.Controller.extend({
    users: Ember.computed.alias('model'),
    permissionSets: Ember.computed(function () {
        return this.store.findAll('permission-set');
    }),
    actions: {
        showChangePermissionDialogue(user) {
            this.set('toBeChangedUser', user);
            this.set('togglePermissionsModal', true);
        },
        saveUser(user) {
            user.save().then((user) => {});
        },
        activateUser(user) {
            user.activate({}).then((response) => {
                this.store.pushPayload('user', response);
            });
        },
        deactivateUser(user) {
            user.deactivate({}).then((response) => {

                this.store.pushPayload('user', response);
            });
        }

    }
});
