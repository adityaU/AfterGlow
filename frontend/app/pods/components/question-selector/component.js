import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Ember.Component.extend(KeyboardShortcuts, {

  didRender() {
    this.$('.question-selector-input').focus();
  },
  questions: Ember.computed(function () {
    return this.get('store').findAll('question')
  }),
  selectedIndex: 0,

  searchedQuestionsObserver: Ember.on('init', Ember.observer('query', 'questions.isFulfilled', function () {
    Ember.run.debounce(this, this.setFilteredQuestions, 300)
  })),
  setFilteredQuestions() {
    this.set('selectedIndex', 0)
    let questions = this.get('questions')
    let query = this.get('query')
    if (query && query != "" && questions) {
      this.set('filteredQuestions', this.get('store').query('question', { q: query, tag: null }))
    } else {
      return this.set('filteredQuestions', questions.filterBy('id'))
    }
  },
  actions: {
    incrementIndex() {
      if (this.get('selectedIndex') >= this.get('filteredQuestions.length') - 1) {
        this.set('selectedIndex', 0)
      } else {
        this.incrementProperty('selectedIndex')
      }
    },

    decrementIndex() {
      if (this.get('selectedIndex') <= 0) {
        this.set('selectedIndex', this.get('filteredQuestions.length') - 1)
      } else {
        this.decrementProperty('selectedIndex')
      }
    },
    goToQuestionClick(question) {
      this.sendAction('goToQuestion', question)
    },
    goToQuestion() {
      this.sendAction('goToQuestion', this.get('filteredQuestions').objectAt(this.get('selectedIndex')))
    }
  },

  keyboardShortcuts: {
    "up": 'decrementIndex',
    "down": 'incrementIndex',
    "enter": 'goToQuestion'
  }
});
