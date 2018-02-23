import Ember from 'ember';

export default Ember.Controller.extend({

    searchedsnapshots: Ember.computed('question.snapshots', 'query', function(){
        let query = this.get('query')
        let snapshots =this.get('question.snapshots')
        if (!query ||  query == "" ){
            return snapshots
        }else{
            return snapshots.filter((item)=> {
                return item.get('name').toLowerCase().indexOf(query.toLowerCase()) >= 0
            })
        }
    })
});
