import Ember from 'ember';
import UtilsFunctions from "frontend/mixins/utils-functions";

var get = Ember.get,
    arrayComputed = Ember.arrayComputed;
export default Ember.Component.extend(UtilsFunctions, {

    didInsertElement(){
        this.getData()
    },

    chartData(item){
        return item.get('contents').sortBy('x1').map((el, j)=> {
        return {
            x: el.x1,
            y: el.y,
            r: (el.y/this.get('maxY')+0.1)*15
        }
    })}, 
});
