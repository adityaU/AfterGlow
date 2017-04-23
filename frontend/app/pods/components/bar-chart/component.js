import Ember from 'ember';
import UtilsFunctions from "frontend/mixins/utils-functions";

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend( UtilsFunctions, {

    didInsertElement(){
        this.get('getData')(this)
    },
    data: Ember.observer('jsonData', 'type', 'xLabel', 'yLable', 'title', function(){
        this.get('getData')(this)
    }),
    getData(_this){
        let gridParent = _this.get('gridParent')
        let gd = _this.get('getNode')(_this)
        var data =  _this.get('jsonData'), layout;
        data = data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
            return series.map((item, j)=>{
                return  {
                    x: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayX1')}),
                    y: item.get('contents').sortBy('x1').map((el)=>{ return el.get('displayY')}),
                    type: 'bar',
                    marker: {
                        color: _this.get('colors')[i + j] 
                    },
                    name: _this.legendName(item, i)
                }
            })
        }));
        layout = data && _this.get('layout')
        layout["barmode"]= "group"
        data && Plotly.newPlot(gd, data, layout, {showLink: false})
            .then(_this.get('downloadAsPNG')); 
        data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
            let dimensions = _this.get('dimensions')(gridParent) 
            Plotly.relayout(_this.get("randomId"), dimensions)
        });
    }
});
