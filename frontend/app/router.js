import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('questions', function() {
    this.route('new');
      this.route('show', {path: '/:question_id'});
  });
  this.route('databases', function() {
      
      this.route('index', {path: '/'});
    this.route('new');
  });


  this.route('dashboards', function() {
      this.route('show', {path: '/:dashboard_id'});
  });
});

export default Router;
