import DS from 'ember-data';


export default DS.Model.extend({
    router: Ember.inject.service(),
    dashboard: DS.belongsTo('dashboard'),
    content: DS.attr('string')
});
