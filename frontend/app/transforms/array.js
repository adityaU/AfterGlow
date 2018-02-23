
import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(value) {
        if (Ember.isArray(value)) {
            return Em.A(value);
        } else {
            return Em.A();
        }
    },
    serialize: function(value) {
        if (Ember.isArray(value)) {
            return Em.A(value);
        } else {
            return Em.A();
        }
    }
})
