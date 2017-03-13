import Ember from 'ember';

export function questionDashboardSettings(params/*, hash*/) {
    let dashboard = params[0]
    let question = params[1]
    let nonEditable = params[2]
    let gridSettings = Ember.Object.create(dashboard.get('settings.gridSettings'))
    return  gridSettings && gridSettings.get(question.id) || {x:0, y:0, width: 6, height:6, noMove: nonEditable, noResize: nonEditable }
}

export default Ember.Helper.helper(questionDashboardSettings);
