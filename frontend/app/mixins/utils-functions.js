import Ember from 'ember';


export default Ember.Mixin.create({
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
              
        }

        return array;

    },
    colors:[
               "#1C9363", "#FF715B",  "#2B59C3", "#215B56",
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
                    displayX1: this.get('display')(item[x1]),
                    x2: item[x2],
                    displayX2: this.get('display')(item[x2]),
                    y: item[y],
                    displayY: this.get('display')(item[y]),
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
        return (parseFloat(el) != NaN)
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
    })
    
});
