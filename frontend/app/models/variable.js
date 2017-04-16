
import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    default: DS.attr('string'),
    var_type: DS.attr('string'),
    column: DS.belongsTo('column'),
    default_operator: DS.attr('string')
})
