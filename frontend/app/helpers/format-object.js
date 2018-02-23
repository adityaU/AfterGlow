import Ember from 'ember';

export function formatObject(params/*, hash*/) {
    if (params && params[0]){
        var formattedString = params;
        params = params[0];
        var objType = (Object.prototype.toString.call(params).replace(/\[object|\]/g, "").trim())
        if (objType == 'Object'){
            formattedString = JSON.stringify(params);
        }else if (objType == 'Array'){
            formattedString = params.map((item) => {
                if (typeof(item) == 'object'){
                    return JSON.stringify(params)
                }else{
                    return params;
                }
            })
        }
        let date = Date.parse(params) 
        let dateMatch = (params.toString().match("-") != null)
        if (date.toString() != 'NaN' && dateMatch){
            date = moment(date).format("LLLL")
            formattedString = moment.tz(date, moment.tz.guess());
        }

        return formattedString;
    }
}

export default Ember.Helper.helper(formatObject);
