import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['full'],
    allQuestions: Ember.computed.sort('questions', function (a, b) {
        if (a.get('updated_at') >= b.get('updated_at')) {
            return -1;
        } else {
            return 1;
        }
    }),
    tags: Ember.computed(function () {
        return this.get('store').findAll('tag');
    }),
    timeZone: moment.tz.guess(),
    actions: {
        showDeleteDialogue(questionToBeDeleted) {
            this.set('questionToBeDeleted', questionToBeDeleted);
            this.set('toggleDeleteDialogue', true);
        },
        addTag(question) {
            this.set('addTagToQuestion', question);
            this.set('toggleTagsModal', true);
        },
        viewSnapshots(question) {
            this.sendAction('transitionToSnapshots', question.id);
        },
        deleteQuestion(question) {
            question.destroyRecord().then((response) => {
                this.sendAction('transitionToIndex');
            });
        },
        getData(tag) {
            this.get('tags').pushObject(tag);
        },
        loadQuestion(question) {
            this.store.query('question', {
                filter: {
                    id: question.id
                }
            });

        },
        refreshQuestion(question) {
            question && question.set('updatedAt', new Date());
            question.set('resultsCanBeLoaded', true);
        },
        toggleQuestionWidget(newQuestion, oldQuestion) {
            oldQuestion && oldQuestion.set('showQuestionWidgetOnListPage', false);
            newQuestion && newQuestion.set('showQuestionWidgetOnListPage', true);
            //Ember.$('html, body').scrollTop(Ember.$(newQuestion));
        }
    }
});
