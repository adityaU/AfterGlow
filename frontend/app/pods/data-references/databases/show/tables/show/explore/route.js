import Ember from 'ember';
import QuestionNewRoute from "../../../../../../questions/new/route"


export default QuestionNewRoute.extend({
    renderTemplate(controller, model) {

        this.render('questions.new', {
            into: 'application',
            controller: controller
        });
    },
    setupController: function(controller, model) {
        this._super(...arguments);
        controller.set('database', this.controllerFor('data_references.databases.show').get('database'));
    }
})
