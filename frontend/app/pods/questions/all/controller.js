import Ember from 'ember';

export default Ember.Controller.extend({
    query: null,
    searchedQuestions: Ember.computed('squestions', 'query', function(){
        let query = this.get('query')
        let questions =this.get('questions')
        if (!query ||  query == "" ){
            return questions
        }else{
            return questions.filter((item)=> {
                return item.get('title').toLowerCase().indexOf(query.toLowerCase()) >= 0
            })
        }
    }),
    questions: Ember.computed.alias("model")
});
