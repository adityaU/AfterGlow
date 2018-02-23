import Ember from 'ember';
import QuestionAllController from "../../questions/all/controller"

export default QuestionAllController.extend({
    questions: Ember.computed.alias("model.questions"),
    showAllTags: false,
    tag: Ember.computed(function(){
        return this.store.find('tag', this.get('tag_id'))
    }),
    pageTitle: Ember.computed('tag', 'tag.isLoaded', function(){
        return "All Questions with Tag: " + this.get('tag.name')
    }),
    search(){
        let query = this.get('query')
        let questions =this.get('questions')
        if (query &&  query != "" ){
            questions =  this.store.query('question', {q: query, tag: this.get('tag_id')} )
        }
        this.set('searchedQuestions', questions)
    },

});
