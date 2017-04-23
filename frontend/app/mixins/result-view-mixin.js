import Ember from 'ember';

export default Ember.Mixin.create({
    resultViewIcons: {
        "Calendar": "calendar outline",
        "Number": "hashtag",
        "Table" : 'table',
        "Line" : 'line chart',
        "Pie" : 'pie chart',
        "Bars" : 'bar chart',
        "Area" : 'area chart',
        "Bubble": 'circle thin'
    },

    resultViewDashboardDefaultDimensions: {
        "Calendar": {width:6, height: 22},
        "Number": {width:3, height: 3},
        "Table" : {width:6, height: 10},
        "Line" : {width:6, height: 6},
        "Pie" : {width:6, height: 8},
        "Bars" : {width:6, height: 6},
        "Area" : {width:6, height: 6},
        "Bubble": {width:6, height: 6}
    },

    findIfDate(el){
        let date = Date.parse(el) 
        let dateMatch = el && (el.toString().match("-") != null)
        return (date.toString() != 'NaN' && dateMatch)
    },
    findIfNumber(el){
        return (parseFloat(el).toString() != NaN.toString())
    },
    any(arr, method){
        return arr.map((item)=>{
            return method.call(this, item)
        }).reduce((a,b)=> { return a || b}, true)
    },
    categoryColumnsCount(row){
        return row.filter((item)=>{
            return !(this.findIfNumber(item) || this.findIfDate(item))
        }).length
    },
    autoDetect(rows){
        if (rows.length == 0){
            return 'Table'
        }
        if (rows.length == 1 && rows[0].length <= 10){
            return 'Number'
        }
        if (rows[0].length == 2 && this.categoryColumnsCount(rows[0]) == 1 && this.any(rows[0], this.findIfNumber)){
            return 'Pie'
        }
        if ((this.any(rows[0], this.findIfDate) || this.any(rows[0], this.findIfNumber)) &&
            this.categoryColumnsCount(rows[0]) < 2 &&
            (rows[0].length - this.categoryColumnsCount(rows[0]) >=2) ){
            return 'Line'
        }
        return 'Table'
    }
});
