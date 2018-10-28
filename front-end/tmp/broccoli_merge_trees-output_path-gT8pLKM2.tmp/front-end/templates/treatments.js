export default Ember.HTMLBars.template({"id":"TAVDNx6Q","block":"{\"symbols\":[\"treatment\",\"assessmentTest\",\"exercisesList\",\"objective\",\"actionStep\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n  \"],[6,\"h1\"],[7],[0,\"Treatments\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[4,\"ui-accordion\",null,[[\"class\",\"style\"],[\"styled\",\"width: 50%\"]],{\"statements\":[[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n        \"],[1,[19,1,[\"rehabilitationPlan\",\"name\"]],false],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n        \"],[6,\"h2\"],[7],[0,\"Exercises\"],[8],[0,\"\\n        \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n          \"],[6,\"thead\"],[7],[0,\"\\n              \"],[6,\"tr\"],[7],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"tfoot\"],[7],[0,\"\\n              \"],[6,\"tr\"],[7],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"rehabilitationPlan\",\"exercisesLists\"]]],null,{\"statements\":[[0,\"              \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,3,[\"exercise\",\"name\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,3,[\"exercise\",\"description\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[19,3,[\"exercise\",\"actionSteps\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"li\"],[7],[1,[19,5,[]],false],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"                  \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[19,3,[\"exercise\",\"objectives\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"li\"],[7],[1,[19,4,[]],false],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                  \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[19,3,[\"exercise\",\"frequency\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[19,3,[\"exercise\",\"duration\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"img\"],[10,\"src\",[26,[[19,3,[\"exercise\",\"image\",\"imageData\"]]]]],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n              \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"          \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"h2\"],[7],[0,\"Assessment Tests\"],[8],[0,\"\\n        \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"rehabilitationPlan\",\"assessmentTests\"]]],null,{\"statements\":[[0,\"            \"],[6,\"li\"],[7],[0,\"\\n              \"],[1,[19,2,[\"form\",\"name\"]],false],[0,\" \"],[1,[25,\"complete-test\",null,[[\"assessmentTest\",\"treatment\"],[[19,2,[]],[19,1,[]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null],[8]],\"hasEval\":false}","meta":{"moduleName":"front-end/templates/treatments.hbs"}});