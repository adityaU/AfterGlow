import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize: function(value) {
        if (null) {
            return {};
        } else {
            let obj = Ember.Object.create({
                database: Ember.Object.create(value.database),
                table: Ember.Object.create(value.table),
                views: value.views && value.views.map((item)=> {return Ember.Object.create(item)}), 
                filters:  value.filters && value.filters.map((item)=> {return Ember.Object.create(item)}), 
                groupBys:  value.groupBys && value.groupBys.map((item)=> {return Ember.Object.create(item)}),
                limit: value.limit,
                offset: value.offset,
                orderBys:  value.orderBys && value.orderBys.map((item)=> {return Ember.Object.create(item)}), 
                queryType: value.queryType,
                rawQuery: value.rawQuery
            })
            return obj;
        }
    },
    serialize: function(value) {
        return value;
    }
})
