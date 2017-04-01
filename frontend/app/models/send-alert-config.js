import DS from 'ember-data';

export default DS.Model.extend({
    alert: DS.belongsTo('alert'),
    message_template: DS.attr('string'),
    comm_type: DS.attr('string'), 
    to_addresses: DS.attr(),
    subject_template: DS.attr('string'),
    created_at: DS.attr('date'),
    updated_at: DS.attr('date')
});
