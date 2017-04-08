import Ember from 'ember';
import QuestionAllController from "../../questions/all/controller"

export default QuestionAllController.extend({
    questions: Ember.computed.alias("model.questions")
});
