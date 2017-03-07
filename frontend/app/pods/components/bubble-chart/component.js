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
    getData(_this){
        var data =  _this.get('jsonData'), layout;
        data = data && data.map((item)=>{
            return  {
                x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
                y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
                type: 'scatter',
                mode: 'markers',
                marker: {
                    size:  item.get('contents').map((el)=>{ return el.get('y')}),
                    color: _this.get('colors'),
                },
                name: item.get('type')
            }
        });
        layout = data &&  {
            title: _this.get('title'),
            xaxis: {title: Ember.String.capitalize(_this.get('xLabel') || _this.get('x1')) , showline: true, ticks: 'inside'},
            yaxis: {title: Ember.String.capitalize(_this.get('yLabel') || _this.get('y')), showline: true, ticks: 'inside'},
            font: {
                family: 'Lato',
                size: '1em',
                color: '#7f7f7f'
                
            }

        }
        data && Plotly.newPlot(document.getElementById(_this.get('randomId')), data, layout, {showLink: false});
    }
});
