import Ember from 'ember';
import UtilsFunctions from "frontend/mixins/utils-functions";

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend(UtilsFunctions, {

    didInsertElement(){
        this.get('getData')(this)
    },
    data: Ember.observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function(){
        this.get('getData')(this)
    }),
    stackedArea(traces) {
        for(var i=1; i<traces.length; i++) {
            for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
                traces[i]['y'][j] += traces[i-1]['y'][j];
                
            }
            
        }
        return traces;

    },

    getData(_this){
        let gd = _this.get('getNode')(_this)
        let gridParent = _this.get('gridParent')
        var data =  _this.get('jsonData'), layout;
        data = data && data.map((item)=>{
            return  {
                x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
                y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
                // type: 'scatter',
                fill: 'tonexty',
                name: item.get('type')
            }
        });
        layout = data &&  {
            title: _this.get('title'),
            margin: _this.get('margin'),
            xaxis: {title: Ember.String.capitalize(_this.get('xLabel') || _this.get('x1')) , autorange: true},
            yaxis: {title: Ember.String.capitalize(_this.get('yLabel') || _this.get('y')), autorange: true},
            barmode: 'group',
            font: {
                family: 'Lato',
                size: '1em',
                color: '#7f7f7f'
                
            }
        }
        data = data && _this.get('stackedArea')(data);
        data && Plotly.newPlot(gd, data, layout, {showLink: false})
            .then(_this.get('downloadAsPNG')); 
        data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
            let dimensions = _this.get('dimensions')(gridParent) 
            Plotly.relayout(_this.get("randomId"), dimensions)
        });
    }
});
