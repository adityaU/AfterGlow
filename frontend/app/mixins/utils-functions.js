import Ember from 'ember';
import ColorMixin from 'frontend/mixins/colors-mixin'
import ResultViewMixin from 'frontend/mixins/result-view-mixin'

export default Ember.Mixin.create(ColorMixin, ResultViewMixin, {
    display(params){
        var formattedString = params;
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
        let dateMatch = (params && params.toString().match("-") != null)
        if (date.toString() != 'NaN' && dateMatch){
                formattedString = moment(date).format("YYYY-MM-DD HH:mm:ss.SSS")
        }

        return formattedString;
        
    },
    margin: {
        // l: 80,
        r: 5,
        b: 30,
        t: 30,
        pad: 0
        
    },
    downloadAsPNG(gd){
        Plotly.toImage(gd,{height:1600,width:1600})
            .then(
                function(url)
                {
                    return Plotly.toImage(gd,{format:'png',height:1600,width:1600});
                }
            )
    },
    gridParent: Ember.computed(function(){
        return this.$("#" + this.get('randomId')).parents('.grid-stack-item')
    }),
    dimensions(gridParent){
        let dimensions = {}
        if (gridParent && gridParent[0]){
            dimensions = {
                height: gridParent.innerHeight() - 90,
                width:  gridParent.innerWidth() - 80
            }
        }
        return dimensions;
    },
    getNode(_this) {
        var d3 = Plotly.d3
        let gridParent = _this.get('gridParent')
        if (!_this.get('chosenColor')){
            _this.set('chosenColor', _this.randomColor())
        }
        let dimensions = _this.get('dimensions')(gridParent)
        dimensions.height && (dimensions.height += "px")
        dimensions.width && (dimensions.width += "px")
        var gd3 = d3.select("#" + _this.get('randomId'))
                .style(dimensions);

        return gd3.node();

    },
    groupBy(data, type) {
        var result = [];

        data.forEach(function(item) {
            var hasType = result.findBy('type', item.get(type));

            if(!hasType) {
                result.pushObject(Ember.Object.create({
                    type: item.get(type),
                    contents: []
                    
                }));
                
            }

            result.findBy('type', item.get(type)).get('contents').pushObject(item);
        });
        return result;
    },
    hiddenJsonData: Ember.computed('jsonData', function(){
        return 'hidden';
    }),
    jsonData: Ember.computed('x1', 'x2', 'multipleYs.@each.columnName', 'results', function(){
        var data = this.get('results');
        var multipleYs = this.get('multipleYs');
        var x1 = this.get('x1');
        var x2 = this.get('x2');
        if (data && x1 && multipleYs && multipleYs.length >=0){
            var x2 = data.columns.indexOf(x2);
            var x1 = data.columns.indexOf(x1);
            var multipleYs = multipleYs.map((y)=> { return data.columns.indexOf(y.columnName)}).filter((i)=>{
                return i >= 0
            });
            data = multipleYs.map((y)=>{
                let d = data.rows.map((item)=>{
                    return Ember.Object.create({
                        x1: item[x1],
                        displayX1: this.get('display')(item[x1]),
                        x2: item[x2],
                        displayX2: this.get('display')(item[x2]),
                        y: item[y],
                        displayY: this.get('display')(item[y]),
                    })
                })
                return this.get('groupBy')(d, 'x2')
            });
            return data;
        }
    }),
    x1: Ember.computed.alias('resultsViewSettings.x1'),
    resultsObserverThatSetsX1: Ember.on('init', Ember.observer('results', 'x1', function(){
        if (!this.get('resultsViewSettings.x1')){
            let results = this.get('results');
            let rows = results &&  results.rows.length && results.rows[0]
            let found = null;
            if (this.get('resultsViewType') == 'Pie'){
                if (rows){

                    for (var i=0; i<rows.length; i++){
                        if (this.findIfNumber(rows[i])) { (found = i); break;}
                    }
                    if ( found == 0 || found){
                        this.set('x1', results.columns[i])
                    }
                }
            }else{
                if (rows){
                    for (var i=0; i<rows.length; i++){
                        if (this.findIfDate(rows[i])) { (found = i); break;}
                    }
                    if ( found == 0 || found){
                        this.set('x1', results.columns[i])
                    }
                    for (var i=0; i<rows.length; i++){
                        if (this.findIfNumber(rows[i])) { (found = i); break;}
                    }
                    if ( found == 0 || found){
                        this.set('x1', results.columns[i])
                    }
                }
            }
        }
    })),
    resultsObserverThatSetsX2: Ember.on('init', Ember.observer('results', 'x2', function(){
        if (!this.get('resultsViewSettings.x1')){
            let results = this.get('results');
            let rows = results &&  results.rows.length && results.rows[0]
            let found = null
            if (!(this.get('resultsViewType') == 'Pie')){
                if (rows){
                    for (var i=0; i<rows.length; i++){
                        if (!(this.findIfDate(rows[i]) || this.findIfNumber(rows[i]))) { (found = i); break;}
                    }
                    if (found == 0 || found){
                        this.set('x2', results.columns[i])
                    }
                }
            }
        }
    })),

    resultsObserverThatSetsMultipleYs: Ember.on('init', Ember.observer('results', 'multipleYs', function(){
        let results = this.get('results');
        let rows = results &&  results.rows.length && results.rows[0]
        let multipleYs = this.get('resultsViewSettings.multipleYs')
        let found = null
        let lengthMultipleYs = multipleYs && multipleYs.filter((item)=>{
            return item.columnName
        }).length
        if (!multipleYs || lengthMultipleYs == 0){
            if (rows){
                if (this.get('resultsViewType') == 'Pie'){
                    for (var i=0; i<rows.length; i++){
                        if (!(this.findIfDate(rows[i]) || this.findIfNumber(rows[i]))) { (found = i); break;}
                    }
                    if ( found == 0 || found){
                        this.set('multipleYs', [{columnName: results.columns[i]}])
                    }
                }else{
                    let multipleYs = rows.filter((item)=>{
                        return !this.findIfDate(item) && this.findIfNumber(item)
                    }).map((item)=>{
                        return {columnName: results.columns[rows.indexOf(item)]}
                    })
                    if (multipleYs.length == 0){
                        this.set('multipleYs', [{}])
                    }else{
                        this.set('multipleYs', multipleYs)
                    }
                }
            }
        }
        
    })),
    x2: Ember.computed.alias('resultsViewSettings.x2'),
    multipleYs: Ember.computed.alias('resultsViewSettings.multipleYs'),
    ys: Ember.on('init', Ember.observer('resultsViewSettings.y', function(){
        let multipleYs = this.get('multipleYs')
        let y = this.get('resultsViewSettings.y') || this.get('y')
        if (y && !multipleYs){
            this.set('multipleYs', [{columnName: y}])
        }else if (y && multipleYs){
            if (!multipleYs.findBy('columnName', y))
            multipleYs.pushObject({columnName: y})
        }else if (!y && multipleYs){
        }else{
            this.set('multipleYs', [{columnName: y}])
        } 
    })),
    y: Ember.computed.alias('resultsViewSettings.y'),
    yLabel: Ember.computed.alias('resultsViewSettings.yLabel'),
    xLabel: Ember.computed.alias('resultsViewSettings.xLabel'),
    title: Ember.computed.alias('resultsViewSettings.title'),
    randomId: Ember.computed(function(){
        
        return  'chart-' + Math.floor((Math.random() * 100000000000000) + 1);
    }),

    layout: Ember.computed('title', 'margin', "xLabel","yLabel", "jsonData", function(){
       return  {
            legend: {orientation: "h", x:0, y:1},
            title: this.get('title'),
            margin: this.get('margin'),
            xaxis: {showgrid: false, zeroline: false, title: Ember.String.capitalize(this.get('xLabel') || this.get('x1')) , autorange: true, showLine: false },
            yaxis: {showgrid: true, zeroline: false, gridcolor: "#f1f1f1", title: Ember.String.capitalize(this.get('yLabel') || this.get('multipleYs')[0].columnName), autorange: true, showLine: false},
            font: {
                family: 'Lato',
                size: '1em',
                color: '#212133'
            }

        }

    }),

    legendName(item, i){
       return  item.get('type') || this.get('multipleYs')[i].columnName
    }
    // chartLine(){},

    // legendName(item, i){
    //     return item.get('type') || this.get('multipleYs')[i].columnName
    // },
    // chartMarker(i, j){
    //     return {
    //         color: this.get('colors')[i + j] 
    //     }
    // },
    // dataModified(data){
    //     return data
    // },
    // chartFill: null,
    // getData(){
    //     let gridParent = this.get('gridParent')
    //         let gd = this.get('getNode')(this)
    //         var data =  this.get('jsonData'), layout;
    //         data = data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
    //             return series.map((item, j)=>{
    //                 return  {
    //                     x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
    //                     y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
    //                     type: this.get("chartType"),
    //                     mode: this.get('chartMode'),
    //                     line: this.chartLine(i, j),
    //                     fill: this.get('chartFill'),
    //                     marker: this.chartMarker(i, j, item),
    //                     name: this.legendName(item, i)
    //                 }
    //             })
    //         }));
    //         layout = data && this.get('layout')
    //         layout["barmode"]= "group"
    //         data = this.dataModified(data)
    //         data && Plotly.newPlot(gd, data, layout, {showLink: false})
    //             .then(this.get('downloadAsPNG')); 
    //         data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
    //             let dimensions = _this.get('dimensions')(gridParent) 
    //             Plotly.relayout(_this.get("randomId"), dimensions)
    //         });
    // }
    
});
