import Ember from 'ember';
import DS from 'ember-data';
export default DS.Model.extend({
    config: DS.attr(),
    value: DS.attr('string'),
    text: DS.attr('string'),
    widget: DS.belongsTo('widget')
});
