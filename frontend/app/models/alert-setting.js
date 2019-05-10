import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    aggregation: DS.attr('string'),
    operation: DS.attr('string'),
    number_of_rows: DS.attr('number'),
    column: DS.attr('string'),
    traversal: DS.attr('string'),
    is_active: DS.attr('boolean'),
    frequency_value_in_seconds: DS.attr('number'),
    start_time: DS.attr('date'),
    scheduled_disabled_config: DS.attr('object'),
    silent_till: DS.attr('date'),
    question: DS.belongsTo('question'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    alert_level_settings: DS.hasMany('alert_level_settings'),
    alert_notification_settings: DS.hasMany('alert_notification_settings')
});