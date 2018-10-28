import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    countryModel: Ember.computed(function(){
        return this.get('store').findAll('country');
    })
});
