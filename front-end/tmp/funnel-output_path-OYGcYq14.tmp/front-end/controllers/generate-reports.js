import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    // downLoad: function(){
    //     steps: [
    //       {setFontSize: 40},
    //       {text: [35, 25, 'Tomsters loves jsPDF']}
    //     ]
    // },
   onClick: function(id) {
     console.log(id);
      var pdf = new jsPDF('p', 'pt', 'letter');
      pdf.canvas.height = 72 * 11;
      pdf.canvas.width = 72 * 8.5;

      pdf.fromHTML(document.body);

      pdf.save(id + '.pdf');
    },
    createPDF: function(givenName, familyName, birthday, email, phone, treatments) {
      var year = parseInt(birthday.slice(0,4));
      var age = new Date().getFullYear() - year;
      var doc = new jsPDF('p', 'pt', 'letter');
      var lineNum = 0;
      var testresultNum = 0;

      var text1 = ('This is a report for ' + givenName + ' ' + familyName);
      var xOffset1 = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text1) * doc.internal.getFontSize() / 2);

      //var text2 = 'Age: ' + new Date().getFullYear() - birthday.getFullYear();
      var text2 ='Age: ' +  age;
      var xOffset2 = 30 + (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text2) * doc.internal.getFontSize() / 2);
       
      doc.setFontSize(14);
      doc.setFontStyle('bold');
      doc.text(text1, xOffset1 + 270, 60, null, 0, 'center');

      doc.setFontStyle('underlined');
      doc.text('Client Information: ', xOffset2, 90, null, 0, 'center');

      doc.setFontStyle('italic');
      doc.text(text2, xOffset2, 120, null, 0, 'center');
      doc.text('Email: '+ email, xOffset2, 140, null, 0, 'center');
      doc.text('Phone: ' +phone, xOffset2, 160, null, 0, 'center');
      doc.line(30, 180, 582, 180);
      doc.setFontStyle('underline');
      lineNum = 200;
      doc.text('Treatments: ', xOffset2, lineNum += 20, null, 0, 'center');
      lineNum += 20;
      for(var i = 0; i < treatments.length; i++){
        doc.setFontStyle('none');
        doc.text(treatments[i].rehabilitationPlan.name, xOffset2, lineNum+=20, null, 0, 'center');
        doc.setFontStyle('italic');
        for(var j = 0; j < treatments[i].rehabilitationPlan.exercisesLists.length; j++){
          if(lineNum >= 700){
            doc.addPage();
            lineNum = 20;
          }
          doc.text(treatments[i].rehabilitationPlan.exercisesLists[j].exercise.name, xOffset2, lineNum+=20, null, 0, 'center');
        }
      }

      doc.setFontStyle('none');
      doc.text('Test Results: ', xOffset2,  lineNum += 30, null, 0, 'center');
      lineNum += 20;
      doc.setFontStyle('italic');

      for(var i = 0; i < treatments.length; i++){
        for(var j = 0; j < treatments[i].rehabilitationPlan.assessmentTests.length; j++){
          for(var k = 0; k < treatments[i].rehabilitationPlan.assessmentTests[j].testResults.length; k++){
            if(treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].treatment === treatments[i].id){
              if(lineNum >= 700){
                doc.addPage();
                lineNum = 20;
              }
              testresultNum += 1;
              doc.text('Question ' + testresultNum.toString() + ': ' + treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].question, xOffset2, lineNum += 20, null, 0, 'center');
              doc.text('Answer ' + testresultNum.toString() + ': ' + treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].answer, xOffset2, lineNum+=20, null, 0, 'center');
            }
          }
        }
      }

      doc.setFontStyle('none');
      doc.text('Recommendations: ', xOffset2,  lineNum += 30, null, 0, 'center');
      lineNum += 20;
      doc.setFontStyle('italic');

      for(var i = 0; i < treatments.length; i++){
        for(var j = 0; j < treatments[i].recommendations.length; j++){
          if(lineNum >= 700){
            doc.addPage();
            lineNum = 20;
          }
          doc.text(treatments[i].recommendations[j].decision, xOffset2, lineNum+=20, null, 0, 'center');
        }
      }
     doc.output('dataurlnewwindow');

   },
   didInsertElement: function() {
     /* Init the table and fire off a call to get the hidden nodes. */
     $(document).ready(function() {
         var table = $('#example').DataTable();
       } );
     }
  }
});