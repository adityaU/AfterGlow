import Ember from 'ember';

export default Ember.Service.extend({
    themeObserver: Ember.on('init', Ember.observer(function(){
        this.set( "darkTheme", localStorage.getItem('agDarkTheme') || false)
    })),
    darkTheme: false,
    darkThemeObserver: Ember.observer('darkTheme', function(){
        localStorage.setItem('agDarkTheme', this.get('darkTheme'))
    })
});
