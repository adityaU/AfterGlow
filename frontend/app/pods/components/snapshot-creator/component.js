import Ember from 'ember';

export default Ember.Component.extend({
    toast: Ember.inject.service(),

    snapshot: Ember.computed(function(){
        return {
            name: `${this.get('question.title')}-${moment().format('LLLL')}`,
            description: `Snapshot of ${this.get('question.title')} on ${moment().format('LLLL')}`
        }
    }),
    actions:{
        createSnapshot(){
            let snapshot = this.store.createRecord('snapshot', {
                name: this.get('snapshot.name'),
                description: this.get('snapshot.description'),
                question: this.get("question")
            })
            snapshot.save().then((response)=> {
                this.get('toast').success(
                    "Your snapshot is being created. You'll get an email when it is complete",
                    'Yay!',
                    {closeButton: true, timeout: 1500, progressBar:false}
                );
            }).error((error)=>{
                this.get('toast').error(
                    "You are not authorized to perform this action",
                    'Sorry Mate!',
                    {closeButton: true, timeout: 1500, progressBar:false}
                );
            })
        }
    }

});
