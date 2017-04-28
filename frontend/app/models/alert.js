import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    config: DS.attr('object'), 
    question: DS.belongsTo('question'),
    created_at: DS.attr('date'),
    updated_at: DS.attr('date'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),

});
