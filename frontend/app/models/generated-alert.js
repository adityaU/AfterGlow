import DS from 'ember-data';

export default DS.Model.extend({
    alert: DS.belongsTo('alert'),
    status: DS.attr('string'),
    failing_conditions: DS.attr('object'), 

    created_at: DS.attr('date'),
    updated_at: DS.attr('date')

});
