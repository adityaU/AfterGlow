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
                values: item.get('contents').map((el)=>{ return el.get('x1')}),
                labels: item.get('contents').map((el)=>{ return el.get('y')}),
                type: 'pie',
                marker: {line: {width: 1.5, color: 'white'}, colors: _this.get("colors")},
                textfont: {color: 'white'},
                name: _this.get('x2') + " - " + item.get('type')
            }
        });
        layout = data &&  {
            title: _this.get('title'),
            margin: _this.get('margin'),
            calendar: 'gregorian',
            font: {
                family: 'Lato',
                size: '1em',
                color: '#7f7f7f'
                
            }

        }
        data && Plotly.newPlot(gd, data, layout, {showLink: false});
        data && gridParent [0] && gridParent[0].addEventListener('plotlyResize', function() {
            let dimensions = _this.get('dimensions')(gridParent) 
            Plotly.relayout(_this.get("randomId"), dimensions)
        });
    }
});
