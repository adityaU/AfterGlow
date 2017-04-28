import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    value: DS.attr('string'),
    column: DS.belongsTo('column'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

    displayName: Ember.computed('name', 'value', function(){
        return (this.get("name") || this.get("value"))
    })

});
