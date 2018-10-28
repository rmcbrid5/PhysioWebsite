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
    modalName: computed(function(){
        return 'Modify-Question' + this.get('ID');
    }),
    actions:{
        openModal: function () {
            $('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    if(!this.get('questionText')){
                        alert('Please enter Question Text.');
                        return false;
                    }
                    if(!this.get('helpDescription')){
                        alert('Please enter a Help Description.');
                        return false;
                    }
                    var self = this;
                    var myStore = self.get('store');

                    myStore.find('question', this.get('ID'))
                    .then(function(question){
                        question.set('questionText', self.get('questionText'));
                        question.set('helpDescription', self.get('helpDescription'));
                        return question.save();
                    }).then(function(){
                        alert('Question saved.');
                    });
                    return true;
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
