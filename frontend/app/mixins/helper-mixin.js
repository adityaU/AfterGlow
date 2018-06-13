import Ember from 'ember';

export default Ember.Mixin.create({

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    titleize(string) {
        var string_array = string.split(' ');
        string_array = string_array.map((str) => {
            return this.capitalize(str);
        });

        return string_array.join(' ');
    },
    unique(arr) {
        var uniqueObjects = [];

        return arr.filter(function (item) {
            if (!uniqueObjects.any(function (i) {
                return i == item;
            })) {
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
    uniqueByName(arr) {
        var uniqueObjects = [];

        return arr.filter(function (item) {
            if (!uniqueObjects.isAny('name', item.get('name'))) {
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
    uniqueByProperty(arr, prop) {
        var uniqueObjects = [];

        return arr.filter(function (item) {
            if (!uniqueObjects.isAny(prop, (item.get && item.get(prop)) || item[prop])) {
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    }
});
