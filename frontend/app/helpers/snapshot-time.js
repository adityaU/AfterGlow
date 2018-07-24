import Ember from 'ember';
var intervalsReverseMapping = {
    7200: '2 hours',
    14400: '4 hours',
    21600: '6 hours',
    28800: '8 hours',
    43200: '12 hours',
    86400: '1 day',
    172800: '2 days',
    604800: '1 week',
    1209600: '2 weeks'
};

export function questionDashboardSettings(params /*, hash*/ ) {
    if (params && params[0]) {
        return intervalsReverseMapping[params[0]];
    }
}

export default Ember.Helper.helper(questionDashboardSettings);
