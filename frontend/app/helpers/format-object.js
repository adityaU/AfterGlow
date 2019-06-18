import Ember from 'ember';
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};
export default Ember.Helper.extend({
    compute(params /*, hash*/ ) {
    if (params && (params[0] || (params[0] == 0) || (params[0] == false))) {
        var formattedString = params;
        params = params[0];
        var objType = (Object.prototype.toString.call(params).replace(/\[object|\]/g, '').trim());
        if (objType == 'Object') {
            formattedString = JSON.stringify(params);
        } else if (objType == 'Array') {
            formattedString = params.map((item) => {
                if (typeof (item) == 'object') {
                    return JSON.stringify(params);
                } else {
                    return params;
                }
            });
        }
        let date = Date.parse(params);
        let dateMatch = (params.toString().match('-') != null);
        if (date.toString() != 'NaN' && dateMatch) {
            date = moment(date);
            date = moment.tz(date, moment.tz.guess());

            if (date.hours() || date.minutes() || date.seconds()) {
                formattedString = date.format('lll');

            } else {
                formattedString = date.format('ll');
            }
        } else if (date.toString() != NaN){
            formattedString = formattedString.toLocaleString()
        }
        if (isValidUrl(params)) {
            formattedString = '<a target="_" href="' + params + '">' + params + '</a>';
        }

        return formattedString;
    }
}
})

