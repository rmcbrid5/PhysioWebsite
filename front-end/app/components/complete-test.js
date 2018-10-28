import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: Ember.computed(function(){
        return 'Assesment-Test' + this.get('ID');
    }),
    actions:  {
      clicky (value) {
        this.set("someAttr", value)
      },
      openModal: function () {
          var self = this;
          var myStore = this.get('store');

          for(var i = 0; i < this.get('assessmentTest').form.questionsLists.length; i++){
              this.get('assessmentTest').form.questionsLists[i].unique = 'Answer ' + i.toString();
          }

          $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    function addTestResults(index){
                        if(index !== self.get('assessmentTest').form.questionsLists.length){
                            var newTestResult = myStore.createRecord('test-result', {
                                question: self.get('assessmentTest').form.questionsLists[index].question.questionText,
                                answer: self.get('assessmentTest').form.questionsLists[index].unique,
                                assessmentTest: self.get('assessmentTest').id,
                                treatment: self.get('treatment').id
                            });
                            return newTestResult.save({reload: true})
                            .then(function(){
                                return addTestResults(index + 1);
                            });
                        }
                        else{
                            alert('Assessment Test Complete.');
                        }
                    }
                    addTestResults(0);
                }
            }).modal('show');
        },
        didInsertElement: function() {
          /* Init the table and fire off a call to get the hidden nodes. */
          $(document).ready(function() {
              var table = $('#example').DataTable();
            } );
          }
      }

});
