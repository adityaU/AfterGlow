import Ember from 'ember';
import CustomEvents from 'frontend/mixins/custom-events'
import LoadingMessages from "frontend/mixins/loading-messages"

export default Ember.Component.extend(LoadingMessages, CustomEvents,{
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
            this.set('editing', true);
            $('.grid-stack-item').each((i, item)=>{
                item.dispatchEvent(this.get('plotlyResize')) 
            })
        },
        showDeleteFromDashboardDialogue(question){
            this.set('toBeDeleted', question)
            $('.ui.modal.delete-dialogue.delete-from-dashboard').modal('show')
        },
        deleteFromDashboard(question){
            let dashboard = this.get('dashboard')
            dashboard.get('questions').removeObject(question)
            dashboard.save()
        }

    }
});
