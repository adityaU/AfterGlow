import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    row: DS.attr('object'),
    snapshot: DS.belongsTo('snapshot'),

    rowValues: Ember.computed.alias('row.values')
});
