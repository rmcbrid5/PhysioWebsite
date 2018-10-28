import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	router: service(),
	beforeModel(){
		if(this.get('oudaAuth').getRole() !== 'pa'){
			this.get('router').transitionTo('home');
		}
	},
	model() {
		var self = this;
		var myStore = this.get('store');

		var patientJSON;

		return myStore.findRecord('patient-profile', this.get('oudaAuth').getPerson(), {reload: true})
		.then(function(patient){
			patientJSON = JSON.parse(JSON.stringify(patient));
			patientJSON.id = patient.id;

			return myStore.findRecord('gender', patientJSON.gender, {reload: true});
		}).then(function(gender){
			var genderJSON = JSON.parse(JSON.stringify(gender));
			genderJSON.id = gender.id;
			patientJSON.gender = genderJSON;
			return myStore.findRecord('country', patientJSON.country, {reload: true});
		}).then(function(country){
			var countryJSON = JSON.parse(JSON.stringify(country));
			countryJSON.id = country.id;
			patientJSON.country = countryJSON;
			return myStore.findRecord('province', patientJSON.province, {reload: true});
		}).then(function(province){
			var provinceJSON = JSON.parse(JSON.stringify(province));
			provinceJSON.id = province.id;
			patientJSON.province = provinceJSON;
			return myStore.findRecord('city', patientJSON.city, {reload: true});
		}).then(function(city){
			var cityJSON = JSON.parse(JSON.stringify(city));
			cityJSON.id = city.id;
			patientJSON.city = cityJSON;
			return patientJSON;
		});
	}
});