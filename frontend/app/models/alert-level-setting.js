import DS from 'ember-data';

export default DS.Model.extend({
    value: DS.attr('string'),
    level: DS.attr('string'),

    alert_setting: DS.belongsTo('alert_setting'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc')
});