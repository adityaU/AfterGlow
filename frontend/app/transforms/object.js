import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(value) {
        if (!$.isPlainObject(value)) {
            return {};
        } else {
            return Ember.Object.create(value);
        }
    },
    serialize: function(value) {
        return value;
    }

});
