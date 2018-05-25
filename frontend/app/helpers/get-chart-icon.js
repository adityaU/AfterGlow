import Ember from 'ember';
import ResultViewMixin from 'frontend/mixins/result-view-mixin';

export function getChartIcon(params /*, hash*/ ) {
    if (params && params[0]) {
        return ResultViewMixin.mixins[0].properties.resultViewIcons[params[0].toLowerCase()];
    }
    return ResultViewMixin.mixins[0].properties.resultViewIcons['Line'];
}

export default Ember.Helper.helper(getChartIcon);
