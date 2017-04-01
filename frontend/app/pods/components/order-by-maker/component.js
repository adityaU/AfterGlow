import Ember from 'ember';

export default Ember.Component.extend({
    labelObserver:Ember.on('init', Ember.observer('orderBy.column', 'orderBy.order', function(){
        let orderBy = this.get('orderBy') 
        if (orderBy){
            let label = (orderBy.get("column.human_name") || orderBy.get('column.name') || orderBy.get('column.value'))
            this.get('orderBy.column') && (label += " : " + this.get('orderBy.order.name'))
            orderBy.set('label', label)
        }
    })),


    orders:[
        {
            
            name: "Asending",
            value: "ASC"
        },
        {
            
            name: "Desending",
            value: "DESC"
        },

    ],

});
