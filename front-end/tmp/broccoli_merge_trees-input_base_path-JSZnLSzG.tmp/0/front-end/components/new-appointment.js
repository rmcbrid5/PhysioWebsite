import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject(),
  DS: inject('store'),
  actions:{
    open: function(date){
      // Disable Monday
      //return date.getDay() === 1;
    },
    doSomethingWithSelectedValue: function(theDate){
      this.set('time', null);
      var date = new Date(theDate);
      this.set("date", date);

      this.set('times', [9, 10, 11, 13, 14, 15]);

      var obj = this;
      var DS = this.get('DS');
      var appointmentsJSON = [];
      var takenTimes = [];
      DS.findAll('appointment', {reload: true})
      .then(function(appointments){
        appointments.forEach(function(appointment){
          var appointmentJSON = JSON.parse(JSON.stringify(appointment));
          appointmentJSON.id = appointment.id;
          appointmentsJSON.push(appointmentJSON);

          var appointmentDate = new Date(appointmentJSON.date);
          
          // appointmentDate is on the same day as the selected date
          if(appointmentDate.getFullYear() == date.getFullYear() &&
          appointmentDate.getMonth() == date.getMonth() &&
          appointmentDate.getDate() == date.getDate()){
            var theTimes = obj.get('times');
            var index = theTimes.indexOf(appointmentDate.getHours()); // index of the matching hour
            // there is a matching hour
            if(index >= 0){
              theTimes.splice(index, 1);  // remove the hour from times
            }
            obj.set('times', theTimes);
          }
        });

        var theTimes = obj.get('times');
        for(var i = 0; i < theTimes.length; i++){
          if(theTimes[i].toString().length == 1){
            theTimes[i] = '0' + theTimes[i].toString() + ':30';
          }
          else{
            theTimes[i] = theTimes[i].toString() + ':30';
          }
        };
        obj.set('times', theTimes);
        obj.notifyPropertyChange('times');
      });
    },
    BookAppointment: function(){
      if(!this.get('date')){
        alert('Must select a date.');
        return;
      }
      if(!this.get('time')){
        alert('Must select a time.');
        return;
      }

      var theDate = this.get('date');
      var hours = parseInt(this.get('time').substring(0, 2));
      var minutes = parseInt(this.get('time').substring(3, 5));
      theDate.setHours(hours);
      theDate.setMinutes(minutes);
      var newPost = this.get('DS').createRecord('appointment', {
        date: theDate,
        reason: this.get('reason'),
        other: this.get('other'),
        patientProfile: this.get('oudaAuth').getPerson()
      });
      newPost.save().then(()=> {
          alert('Your appointment has been booked!');
      });
      return true;
    }
  }
    
});