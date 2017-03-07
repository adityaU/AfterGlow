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
        var data =  _this.get('jsonData'), layout;
        data = data && data.map((item)=>{
            return  {
                x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
                y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
                type: 'scatter',
                fill: 'tozeroy',
                name: item.get('type')
            }
        });
        layout = data &&  {
            title: _this.get('title'),
            xaxis: {title: Ember.String.capitalize(_this.get('xLabel') || _this.get('x1')) , showline: true, ticks: 'inside'},
            yaxis: {title: Ember.String.capitalize(_this.get('yLabel') || _this.get('y')), showline: true, ticks: 'inside'},
            barmode: 'group',
            font: {
                family: 'Lato',
                size: '1em',
                color: '#7f7f7f'
                
            }

        }
        data = data && _this.get('stackedArea')(data);
        data && Plotly.newPlot(document.getElementById(_this.get('randomId')), data, layout, {showLink: false});
    }
});
