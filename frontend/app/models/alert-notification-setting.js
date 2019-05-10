import DS from 'ember-data';

export default DS.Model.extend({
    method: DS.attr('string'),
    recipients: DS.attr('array'),
    alert_setting: DS.belongsTo('alert_setting'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc')
});