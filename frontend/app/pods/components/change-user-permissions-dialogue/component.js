import Ember from 'ember';

export default Ember.Component.extend({
    selectedPermissionSets: Ember.computed('user.permission_sets', function () {
        return this.get('user.permission_sets') && this.get('user.permission_sets').map((item) => {
            return this.get('store').peekRecord('permissionSet', item.get('id'));
        });
    }),
    userNameOrEmail: Ember.computed.or('user.full_name', 'user.email'),
    actions: {
        clear() {
            this.set('open', false);
        },
        saveUserPermissions() {
            this.set('open', false);
            this.sendAction('saveUserPermissions', this.get('user'));
        }
    }
});
