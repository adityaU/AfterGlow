import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function (value) {
        if (!$.isPlainObject(value)) {
            return [];
        } else {
            return Object.keys(value).map((key) => {
                return Ember.Object.create({
                    key: key,
                    value: value[key]
                });
            });
        }
    },
    serialize: function (array) {
        let obj = {};
        array.forEach((item) => {
            obj[item.key] = item.value;
        });
        return obj;
    }

});
