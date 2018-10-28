import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('clients');
  this.route('exercise');
  this.route('forms');
  this.route('home', {path:'/'});
  this.route('login');
  this.route('manage-users');
  this.route('questions');
  this.route('rehab-plans');
  this.route('book-appointment');
  this.route('patient-profiles');
  this.route('make-payment');
  this.route('assessment-tests');
  this.route('about');
  this.route('blog');
  this.route('faq');
  this.route('how-it-works');
  this.route('services');
  this.route('log-out');
  this.route('create-accounts');
  this.route('admin');
  this.route('generate-reports');
  this.route('injury-forms');
  this.route('fill-injury-form');
  this.route('treatments');
  this.route('admin-profile');
  this.route('physio-profile');
  this.route('my-images');
  this.route('patient-images');
  this.route('physio-completed-injury-forms');
  this.route('appointments');
});

export default Router;