import Ember from 'ember';
import CustomEvents from 'frontend/mixins/custom-events'

export default Ember.Component.extend(CustomEvents,{
    classNames: ["full"],
    didInsertElement(){
        Ember.run.next(() => {  // begin loop
            $('.grid-stack-item').each((i, item)=>{
                item.dispatchEvent(this.get('plotlyResize')) 
            })
        })
    },
    actions: {
        change(args){
            let settings = {}
            let questions = this.get('dashboard.questions')
            this.set('editing', true);
            questions.forEach((item)=>{
                let el = $("#" + item.get('id')).parents('.grid-stack-item')
                settings[item.get('id')] = {
                    x: el.data('gs-x'),
                    y: el.data('gs-y'),
                    width: el.data('gs-width'),
                    height: el.data('gs-height')
                    // noMove: this.get('nonEditable'),
                    // noResize: this.get('nonEditable')
                }
            })
            this.set('dashboard.settings', Ember.Object.create(settings))
            $('.grid-stack-item').each((i, item)=>{
                item.dispatchEvent(this.get('plotlyResize')) 
            })
        } 
    }
});
