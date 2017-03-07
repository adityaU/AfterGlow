import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    data_type: DS.attr('string'),
    human_name: DS.attr('string'),
    table: DS.belongsTo('table')

});
