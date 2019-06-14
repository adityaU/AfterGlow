import Ember from 'ember';

export default Ember.Controller.extend({
    organizations: Ember.computed.sort('model', function (a, b) {
        if (a.get('name').toLowerCase() <= b.get('name').toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    }),

    actions: {
        deactivate(org) {
            org.set('is_deactivated', true)
            org.save()
        },

        activate(org) {
            org.set('is_deactivated', false)
            org.save()
        }
    }
});
