import Ember from 'ember';

export default Ember.Mixin.create({
    unique(arr){
        var uniqueObjects = [];

        return arr.filter(function(item){
            if(!uniqueObjects.any(function(i){return i == item})){
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
    uniqueByName(arr){
        var uniqueObjects = [];

        return arr.filter(function(item){
            if(!uniqueObjects.isAny('name', item.get('name'))){
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
    uniqueByProperty(arr, prop){
        var uniqueObjects = [];

        return arr.filter(function(item){
            if(!uniqueObjects.isAny(prop, (item.get && item.get(prop)) || item[prop]  )){
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
});
