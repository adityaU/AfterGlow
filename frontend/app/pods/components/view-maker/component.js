import Ember from 'ember';

export default Ember.Component.extend({
    labelObserver: Ember.on('init', Ember.observer('selectView.selected', function(){
        let selectView = this.get('selectView') 
        if (selectView){
            if (selectView.get('selected.raw') == true){
                selectView.set('selected.human_name', null)
                selectView.set('selected.name', null)
            }
            let label = (selectView.get("selected.human_name") || selectView.get('selected.name') || selectView.get('selected.value'))
            selectView.set('label', label)
        }
    })),

    viewOptions: [
        {
            name: "Raw Data",
            value: "raw_data"
        },
        {
            name: "Count",
            value: "count"
        }
    ],

    actions:{
        switchToBuilder(type, el, handleSelected){
            this.sendAction("switchToBuilder", type,el, handleSelected); 
        },
        switchToRaw(type, el, handleSelected){
            this.sendAction("switchToRaw", type,el, handleSelected); 
        }
    }
});
