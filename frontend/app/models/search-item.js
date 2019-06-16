
import DS from 'ember-data';


export default DS.Model.extend({
    title: DS.attr('string'),
    item_type: DS.attr('string'),
    type_id: DS.attr('string')
})
