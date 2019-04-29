import Ember from 'ember';

export default Ember.Controller.extend({
    users: Ember.computed.sort('model', function (a, b) {
        if (a.get('full_name') && a.get('full_name').toLowerCase() <= a.get('full_name') && b.get('full_name').toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    }),

    actions: {
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
