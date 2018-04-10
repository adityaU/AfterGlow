import Ember from 'ember';

export default Ember.Controller.extend({
    query: null,
    pageTitle: "All Questions",
    searchedQuestionsObserver: Ember.observer('questions', 'query', function(){
        Ember.run.debounce(this, this.search, 300)
    }),

    search(){
        let query = this.get('query')
        let questions =this.get('questions')
        if (query &&  query != "" ){
            questions =  this.store.query('question', {q: query, tag: null} )
        }
        this.set('searchedQuestions', questions)
    },
    questions: Ember.computed.alias("model"),
    setResultsCanBeLoaded: Ember.on('init', Ember.observer('questions', 'dashboard.isLoaded', function(){
        let questions = this.get('questions')
        questions && questions.forEach((item)=>{
            item.set('resultsCanBeLoaded', false)
        })
    })),
    showAllTags: true,
    tags: Ember.computed(function(){
        return this.store.findAll('tag')
    }),
    actions:{
        transitionToSnapshots(questionId){
            this.transitionToRoute('questions.show.snapshots.all', questionId)
        }
    }
});
