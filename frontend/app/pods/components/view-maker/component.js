import Ember from 'ember';

export default Ember.Component.extend({
    // labelObserver: Ember.on('init', Ember.observer('selectView.selected', 'selectView.selected.value', 'selectView.selected.raw', 'selectView.selected.human_name', 'selectView.selected.name', function () {
    //     let selectView = this.get('selectView')
    //     if (selectView) {
    //         selectView = Ember.Object.create(selectView)
    //         if (selectView.get('selected.raw') == true) {
    //             selectView.set('selected.human_name', null)
    //             selectView.set('selected.name', null)
    //         }
    //         let label = (selectView.get("selected.human_name") || selectView.get('selected.name') || selectView.get('selected.value'))

    //         this.set('selectView.label', label)
    //     }
    // })),

    viewOptions: [{
        name: "Raw Data",
        value: "raw_data"
    },
    {
        name: "Count",
        value: "count"
    }
    ],

    actions: {
        setSelected(value) {
            this.set('selectView.selected', value)
        },
        switchToBuilder(type, el, handleSelected) {
            this.sendAction("switchToBuilder", type, el, handleSelected);
        },
        switchToRaw(type, el, handleSelected) {
            this.sendAction("switchToRaw", type, el, handleSelected);
        }
    }
});
