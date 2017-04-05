import Ember from 'ember';


export default Ember.Mixin.create({
    classNames: ["height-90"],
    
    // shuffle(array) {
    //     var currentIndex = array.length, temporaryValue, randomIndex;

    //     // While there remain elements to shuffle...
    //     while (0 !== currentIndex) {

    //         // Pick a remaining element...
    //         randomIndex = Math.floor(Math.random() * currentIndex);
    //         currentIndex -= 1;

    //         // And swap it with the current element.
    //         temporaryValue = array[currentIndex];
    //         array[currentIndex] = array[randomIndex];
    //         array[randomIndex] = temporaryValue;
              
    //     }

    //     return array;

    // },

    colors:[
        "#1C9363", "#FF715B", "#E6AF2E", "#2B59C3", "#215B56",
        "#301966", "#D36582", "#820646", "#649BC1", "#4B3F72",
        "#db3340", "#df514c", "#5c2d50", "#5e3448", "#53bbf4",
        "#59c4c5", "#bff073", "#e45f56", "#c91b26", "#737495",
        "#5c2d50", "#20457c", "#0f5959", "#9f92aa", "#ffa200",
        "#24a8ac", "#ff4c65", "#e94c6f", "#354458", "#69d2e7",
        "#dc2742", "#3a0256", "#17a697", "#064789", "#ffc33c"
    ] ,
    randomColor(_this){
        let arr = _this.get("colors");
        return arr[Math.floor(Math.random() * arr.length)]
    },

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
        }else if(this.findIfDate(params)){
            formattedString = moment(params).format('llll')
        }else if(this.findIfNumber(params)){
            formattedString = params.toLocaleString()
        }

        return formattedString;
        
    },
    margin: {
        // l: 80,
        r: 10,
        // b: 30,
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
        if (gridParent[0]){
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
            _this.set('chosenColor', _this.get("randomColor")(_this))
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
    jsonData: Ember.computed('x1', 'x2', 'y', 'results', function(){
        var data = this.get('results');
        var y = this.get('y');
        var x1 = this.get('x1');
        var x2 = this.get('x2');
        if (data && x1 && y){
            var x2 = data.columns.indexOf(x2);
            var x1 = data.columns.indexOf(x1);
            var y = data.columns.indexOf(y);
            data = data.rows.map((item)=>{
                return Ember.Object.create({
                    x1: item[x1],
                    displayX1: this.display(item[x1]),
                    x2: item[x2],
                    displayX2: this.display(item[x2]),
                    y: item[y],
                    displayY: this.display(item[y]),
                })
            });
            return this.get('groupBy')(data, 'x2');
        }
    }),
    findIfDate(el){
        let date = Date.parse(el) 
        let dateMatch = el && (el.toString().match("-") != null)
        return (date.toString() != 'NaN' && dateMatch)
    },
    findIfNumber(el){
        return (el && parseFloat(el) != NaN)
    },
    selectScale(el){
        if(this.findIfDate(el)){
            return 'time'
        }else if(this.findIfNumber(el)){
            return 'linear'
        }else{
            return 'category'
        }
    },
    x1: Ember.computed('results', 'resultsViewSettings.x1', function(){
        let x1 = this.get('resultsViewSettings.x1')
        if (x1){
            return x1;
        }else{
            let results = this.get('results');
            let rows = results &&  results.rows.length && results.rows[0]
            if (rows){
                let found = null;
                for (var i=0; i<rows.length; i++){
                    if (this.get('findIfDate')(rows[i])) { (found = i); break;}
                }
                if (found){
                    return results.columns[i]
                }
                for (var i=0; i<rows.length; i++){
                    if (this.get('findIfNumber')(rows[i])) { (found = i); break;}
                }
                return results.columns[i]
            }
        }
    }),
    opacity(hex, opacity) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        result = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: opacity    
        } : null;
        return `rgba(${result.r},${result.g}, ${result.b}, ${result.a} )`
    },
    x2: Ember.computed.alias('resultsViewSettings.x2'),
    y: Ember.computed('results', 'resultsViewSettings.y', function(){
        let y = this.get('resultsViewSettings.y')
        if (y){
            return y;
        }else{
            let results = this.get('results');
            let rows =  results && results.rows.length && results.rows[0]
            if (rows){
                let found = null;
                for (var i=0; i<rows.length; i++){
                    if (this.get('findIfNumber')(rows[i])) { (found = i); break;}
                }
                return results.columns[i]
            }
        }
    }),
    yLabel: Ember.computed.alias('resultsViewSettings.yLabel'),
    xLabel: Ember.computed.alias('resultsViewSettings.xLabel'),
    title: Ember.computed.alias('resultsViewSettings.title'),
    randomId: Ember.computed(function(){
        
        return  'chart-' + Math.floor((Math.random() * 100000000000000) + 1);
    }),

    data: Ember.computed('jsonData', 'type', 'xLabel', 'yLable', 'title', function(){
        return this.getData()
    }),

    fill: false,
    lineTension: 0,
    backgroundColor(i){return this.opacity(this.get('colors')[i], 0.7)},
    borderColor(i){return this.get('colors')[i]},
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor(i){ return this.get('colors')[i]}, 
    hoverBackgroundColor(i){ return this.get('colors')[i]}, 
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius(item){return (30/(item.get('contents.length') + 1)) + 3},
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor(i){return this.get('colors')[i]},
    pointHoverBorderWidth: 2,
    pointRadius(item){ return (20/(item.get('contents.length') + 1)) + 2},
    pointHitRadius: 10,
    calculateXScale(item){
        return this.set('xScale', this.selectScale(item.get('contents').objectAt(0).x1))
    },
    calculateYScale(item){
        return this.set('yScale', this.selectScale(item.get('contents').objectAt(0).y))
    },
    labels(data){
      return data.map((item, i)=>{return  Ember.String.capitalize( item.get('type') || this.get('y')) })
    },
    chartData(item){
        return item.get('contents').sortBy('x1').map((el, j)=> {
        return {
            x: el.x1,
            y: el.y,
            r: (el.y/this.get('maxY')+0.1)*15
        }
    })}, 
    getData(){
        
        // let gd = _this.get('getNode')(_this)
        // let gridParent = _this.get("gridParent")
        var data =  this.get('jsonData'), layout;
        return  data && {
            labels: this.labels(data), 
            datasets: data.map((item, i)=>{
                this.calculateXScale(item);
                this.calculateYScale(item);

                this.set('maxY', Math.max.apply(this,item.get('contents').map((el)=>{return +el.y})))
                return {
                    label: Ember.String.capitalize( item.get('type') || this.get('y')) ,
                    data: this.chartData(item),
                    fill: this.get('fill'),
                    lineTension: this.get('lineTension'),
                    backgroundColor: this.backgroundColor(i),
                    borderColor:  this.borderColor(i),
                    borderCapStyle:  this.get('borderCapStyle'),
                    borderDash: this.get('borderDash'),
                    borderDashOffset: this.get('borderDashOffset'),
                    borderJoinStyle: this.get('borderJoinStyle'),
                    pointBorderColor: this.pointBorderColor(i), 
                    pointBackgroundColor: this.get('pointBackgroundColor'),
                    pointBorderWidth: this.get('pointBorderWidth'),
                    pointHoverRadius:  this.pointHoverRadius(item),
                    pointHoverBackgroundColor: this.get('pointHoverBackgroundColor'),
                    pointHoverBorderColor: this.pointHoverBorderColor(i),
                    pointHoverBorderWidth: this.get('pointBorderWidth'),
                    pointRadius: this.pointRadius(item),
                    pointHitRadius: this.get('pointHitRadius'),
                    hoverBackgroundColor: this.hoverBackgroundColor(i)
                }
            })
        };
        // layout = data &&  {
        //     legend: {orientation: "h", x:0, y:1},
        //     title: _this.get('title'),
        //     margin: _this.get('margin'),
        //     xaxis: {title: Ember.String.capitalize(_this.get('xLabel') || _this.get('x1')) , autorange: true, showLine: false },
        //     yaxis: {title: Ember.String.capitalize(_this.get('yLabel') || _this.get('y')), autorange: true, showLine: false},
        //     font: {
        //         family: 'Lato',
        //         size: '1em',
        //         color: '#7f7f7f'
        //     }

        // }
        // data && Plotly.newPlot(gd, data, layout, {showLine: false})
        //     .then(_this.get('downloadAsPNG')); 
        // data && gridParent[0] && gridParent[0].addEventListener('plotlyResize', function() {
        //     let dimensions = _this.get('dimensions')(gridParent) 
        //     Plotly.relayout(_this.get("randomId"), dimensions)
        // });
    },
    chartScales: Ember.computed(function(){
        return {
            xAxes: [{
                type: this.get('xScale'),
                position: 'bottom',
            }],
            yAxes: [{
                stacked: this.get('stacked'),
                type: this.get('yScale')
            }]
        } 
    }),
    stacked: false,
    legendPosition: 'top',
    chartOptions: Ember.computed('xScale', 'yScale', function(){
        let _this = this 
        return {
            responsive: true,
            legend: {position: this.get('legendPosition')},
            maintainAspectRatio: false,
            title:  this.get('title'),
            scales: this.get('chartScales'),
            tooltips: {
                callbacks: {
                    title: function(tooltipItems, data){
                        return null
                    },
                    beforeLabel: function(tooltipItem, data) {
                        return "Y : "  + _this.display(tooltipItem.yLabel)
                    },
                    label: function(tooltipItem, data) {
                        return "X: " + _this.display(tooltipItem.xLabel)
                    }
                },
                custom: function (tooltip) {

                    if (!tooltip) {
                        tooltipEl.css({
                            opacity: 0
                        });
                        return;
                    }
                    tooltip.backgroundColor = "rgb(0, 0, 0, 0.7)"
                    tooltip.bodyFontColor = "#fff"
                    tooltip.footerFontColor = "#fff"
                    tooltip.titleFontColor = "#fff"
                }
            }
        }
    })
    
});
