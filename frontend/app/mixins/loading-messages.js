import Ember from 'ember';

export default Ember.Mixin.create({
    loadingMessage: (function(){
        let arr=  [
            "All good things take time. :)",
            "Be calm, and let it load. :)",
        ]
        return arr[Math.floor(Math.random() * arr.length)]
    })()

});
