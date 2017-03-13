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
        let gd = _this.get('getNode')(_this)
        let gridParent = _this.get('gridParent')
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
            margin: _this.get('margin'),
            xaxis: {title: Ember.String.capitalize(_this.get('xLabel') || _this.get('x1')) , autorange: true},
            yaxis: {title: Ember.String.capitalize(_this.get('yLabel') || _this.get('y')), autorange: true},
            font: {
                family: 'Lato',
                size: '1em',
                color: '#7f7f7f'
                
            }

        }
        data && Plotly.newPlot(gd, data, layout, {showLink: false})
            .then(_this.get('downloadAsPNG')); 
        data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
            let dimensions = _this.get('dimensions')(gridParent) 
            Plotly.relayout(_this.get("randomId"), dimensions)
        });
    }
});
