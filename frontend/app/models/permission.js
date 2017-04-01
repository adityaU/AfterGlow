import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    permission_set: DS.belongsTo('permission_set')

});
