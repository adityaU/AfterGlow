import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    data_type: DS.attr('string'),
    human_name: DS.attr('string'),
    table: DS.belongsTo('table'),

    isDateType: Ember.computed('data_type', function(){
        let dataType = this.get('data_type')
        if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone')){
            return true
        }else{
            return false
        }

    })

});
