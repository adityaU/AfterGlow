import DS from 'ember-data';

export default DS.Model.extend({
    alert: DS.belongsTo('alert'),
    message_template: DS.attr('string'),
    comm_type: DS.attr('string'), 
    to_addresses: DS.attr(),
    subject_template: DS.attr('string'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
});
