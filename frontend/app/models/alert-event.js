import DS from 'ember-data';

export default DS.Model.extend({
    alert_level: DS.attr('string'),
    row_numbers: DS.attr('array'),
    data: DS.attr('object'),
    is_data_saved: DS.attr('boolean'),
    alert_level_setting: DS.belongsTo('alert_level_setting'),
    alert_setting: DS.belongsTo('alert_setting'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc')
});