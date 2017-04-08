import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    color: DS.attr('string'),
    questions: DS.hasMany('question'),
    dashboards: DS.hasMany('dashboard')

});
