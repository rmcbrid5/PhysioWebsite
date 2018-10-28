import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    questionModel: Ember.computed(function(){
        return this.get('store').findAll('question');
    }),
    assessmentTestModel: Ember.computed(function(){
        return this.get('store').findAll('assessment-test');
    }),
    profileModel: Ember.computed(function(){
        return this.get('store').findAll('patientProfile');
        //fix to work wit fname/lname
    }),

    pairModel: [],
    postsData: null,
    title: Ember.computed.oneWay('postsData.title'),
    body: Ember.computed.oneWay('postsData.body'),
    modalName: Ember.computed(function(){
        return 'Client-Report' + this.get('ID');
    }),
    actions:{
        openModal: function () {
            Ember.$('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    this.get('DS').find('form', this.get('form').id).then((form) => {
                      //fix these - new model with fname and lname passes etc. (passed in forms.hbs)
                        form.set('name', this.get('name'));
                        form.set('description', this.get('description'));
                        form.set('administrator', this.get('administrator'));
                        form.set('assessmentTests', this.get('assessmentTests'));
                        form.set('questions', this.get('questions'));
                        form.save().then(()=> {
                            return true;
                        });
                    });
                }
            })
            .modal('show');
          }
      },
      didInsertElement: function() {
        /* Init the table and fire off a call to get the hidden nodes. */
        $(document).ready(function() {
            var table = $('#example').DataTable();
          } );
        }
  });
