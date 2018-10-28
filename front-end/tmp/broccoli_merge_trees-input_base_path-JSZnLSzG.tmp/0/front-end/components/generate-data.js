import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    actions: {
        generateData: function(){
            var store = this.get('store');
            var DS = this.get('DS');

            function randomId(modelName){
                for(var i = 0; i < modelIds.length; i++){
                    if(modelIds[i].name === modelName){
                        return modelIds[i].list[Math.floor(modelIds[i].list.length*Math.random())];
                    }
                }
            }

            function saveFunc(iIndex, jIndex){
                if(iIndex !== modelLists.length){
                    if(jIndex !== modelLists[iIndex].length){
                        return modelLists[iIndex][jIndex].save({reload: true})
                        .then(function(){
                            return saveFunc(iIndex, jIndex + 1);
                        }).catch(function(err){
                            console.log(err);
                            throw new Error(err);
                        });
                    }
                    else{
                        return saveFunc(iIndex + 1, 0)
                        .catch(function(err){
                            console.log(err);
                            throw new Error(err);
                        });
                    }
                }
                else{
                    modelLists = [];
                    iteration++;

                    return findIds(0)
                    .catch(function(err){
                        console.log(err);
                        throw new Error(err);
                    });
                }
            }

            function findIds(index){
                if(index !== modelIds.length){
                    return DS.findAll(modelIds[index].name, {reload: true})
                    .then(function(models){
                        models.forEach(function(model){
                            modelIds[index].list.push(model.id);
                        });
                        return findIds(index + 1);
                    }).catch(function(err){
                        console.log(err);
                        throw new Error(err);
                    });
                }
                else{
                    if(iteration == 1){
                        console.log('Done first iteration.');
                        var forms = [];
                        modelLists.push(forms);
                        modelIds.push({name: 'form', list: []});

                        for(var i = 0; i < 15; i++){
                            forms.push(DS.createRecord('form', {
                                name: 'Form_Name_' + i.toString(),
                                description: 'Form_Description_' + i.toString(),
                                administrator: randomId('administrator')
                            }));
                        }

                        var questions = [];
                        modelLists.push(questions);
                        modelIds.push({name: 'question', list: []});

                        for(var i = 0; i < 30; i++){
                            questions.push(DS.createRecord('question', {
                                questionText: 'Question_QuestionText_' + i.toString(),
                                helpDescription: 'Question_HelpDescription_' + i.toString(),
                                questionType: randomId('questionType')
                            }));
                        }

                        var patientProfiles = [];
                        modelLists.push(patientProfiles);
                        modelIds.push({name: 'patientProfile', list: []});

                        for(var i = 0; i < 50; i++){
                            patientProfiles.push(DS.createRecord('patientProfile', {
                                familyName: 'PatientProfile_FamilyName_' + i.toString(),
                                givenName: 'PatientProfile_GivenName_' + i.toString(),
                                email: 'PatientProfile_Email_' + i.toString(),
                                DOB: new Date(),
                                postalCode: 'PatientProfile_PostalCode_' + i.toString(),
                                phone: 'PatientProfile_Phone_' + i.toString(),
                                maritalStatus: 'PatientProfile_MaritalStatus_' + i.toString(),
                                occupation: 'PatientProfile_Occupation_' + i.toString(),
                                country: randomId('country'),
                                province: randomId('province'),
                                city: randomId('city'),
                                gender: randomId('gender')
                            }));
                        }

                        var rehabilitationPlans = [];
                        modelLists.push(rehabilitationPlans);
                        modelIds.push({name: 'rehabilitationPlan', list: []});

                        for(var i = 0; i < 10; i++){
                            rehabilitationPlans.push(DS.createRecord('rehabilitationPlan', {
                                name: 'RehabilitationPlan_Name_' + i.toString(),
                                description: 'RehabilitationPlan_Description_' + i.toString(),
                                physiotherapist: randomId('physiotherapist'),
                                goal: 'RehabilitationPlan_Goal_' + i.toString(),
                                timeFrameToComplete: new Date()
                            }));
                        }

                        var exercises = [];
                        modelLists.push(exercises);
                        modelIds.push({name: 'exercise', list: []});

                        for(var i = 0; i < 25; i++){
                            exercises.push(DS.createRecord('exercise', {
                                name: 'Exercise_Name_' + i.toString(),
                                description: 'Exercise_Description_' + i.toString(),
                                objectives: ['Exercuse_Objectives_' + i.toString()],
                                physiotherapist: randomId('physiotherapist'),
                                actionSteps: ['Exercise_ActionSteps_' + i.toString()],
                                location: 'Exercise_Location_' + i.toString(),
                                frequency: i,
                                duration: i,
                                targetDate: new Date()
                            }));
                        }
                    }
                    else if(iteration == 2){
                        console.log('Done second iteration.');
                        var questionsLists = [];
                        modelLists.push(questionsLists);
                        modelIds.push({name: 'questionsList', list: []});

                        for(var i = 0; i < 30; i++){
                            questionsLists.push(DS.createRecord('questionsList', {
                                form: randomId('form'),
                                question: randomId('question')
                            }));
                        }

                        var treatments = [];
                        modelLists.push(treatments);
                        modelIds.push({name: 'treatment', list: []});

                        for(var i = 0; i < 50; i++){
                            treatments.push(DS.createRecord('treatment', {
                                dateAssigned: new Date(),
                                physiotherapist: randomId('physiotherapist'),
                                rehabilitationPlan: randomId('rehabilitationPlan'),
                                patientProfile: randomId('patientProfile')
                            }));
                        }

                        var exercisesLists = [];
                        modelLists.push(exercisesLists);
                        modelIds.push({name: 'exercisesList', list: []});

                        for(var i = 0; i < 50; i++){
                            exercisesLists.push(DS.createRecord('exercisesList', {
                                rehabilitationPlan: randomId('rehabilitationPlan'),
                                exercise: randomId('exercise')
                            }));
                        }

                        var payments = [];
                        modelLists.push(payments);
                        modelIds.push({name: 'payment', list: []});

                        for(var i = 0; i < 30; i++){
                            payments.push(DS.createRecord('payment', {
                                dayTimeStamp: new Date(),
                                amount: i,
                                note: 'Payment_Note_' + i.toString(),
                                patientProfile: randomId('patientProfile')
                            }));
                        }

                        var appointments = [];
                        modelLists.push(appointments);
                        modelIds.push({name: 'appointment', list: []});

                        for(var i = 0; i < 1; i++){
                            appointments.push(DS.createRecord('appointment', {
                                date: new Date(),
                                reason: 'Appointment_Reason_' + i.toString(),
                                other: 'Appointment_Other_' + i.toString(),
                                patientProfile: randomId('patientProfile')
                            }));
                        }

                        var assessmentTests = [];
                        modelLists.push(assessmentTests);
                        modelIds.push({name: 'assessmentTest', list: []});

                        for(var i = 0; i < 40; i++){
                            assessmentTests.push(DS.createRecord('assessmentTest', {
                                name: 'AssessmentTest_Name_' + i.toString(),
                                description: 'AssessmentTest_Description_' + i.toString(),
                                rehabilitationPlan: randomId('rehabilitationPlan'),
                                form: randomId('form')
                            }));
                        }

                        var injuryForms = [];
                        modelLists.push(injuryForms);
                        modelIds.push({name: 'injuryForm', list: []});

                        for(var i = 0; i < 30; i++){
                            injuryForms.push(DS.createRecord('injuryForm', {
                                name: 'InjuryForm_Name_' + i.toString(),
                                form: randomId('form')
                            }));
                        }

                        var images = [];
                        modelLists.push(images);
                        modelIds.push({name: 'image', list: []});

                        var chosenIds = [];

                        while(true){
                            if(chosenIds.length === 25){
                                break;
                            }
                            var exerciseId = randomId('exercise');
                            if(chosenIds.indexOf(exerciseId) != -1){
                                continue;
                            }
                            else{
                                chosenIds.push(exerciseId);
                                images.push(DS.createRecord('image', {
                                    name: 'Image_Name_' + i.toString(),
                                    type: 'Image_Type_' + i.toString(),
                                    size: 'Image_Size_' + i.toString(),
                                    rawSize: i,
                                    imageData: 'Image_Data_' + i.toString(),
                                    exercise: exerciseId,
                                    patientProfile: null
                                }));
                            }
                        }
                    }
                    else if(iteration == 3){
                        console.log('Done third iteration.');
                        var testResults = [];
                        modelLists.push(testResults);
                        modelIds.push({name: 'testResult', list: []});
    
                        for(var i = 0; i < 50; i++){
                            testResults.push(DS.createRecord('testResult', {
                                question: 'TestResult_Question_' + i.toString(),
                                answer: 'TestResult_Answer_' + i.toString(),
                                assessmentTest: randomId('assessmentTest'),
                                treatment: randomId('treatment')
                            }));
                        }
    
                        var recommendations = [];
                        modelLists.push(recommendations);
                        modelIds.push({name: 'recommendation', list: []});
    
                        for(var i = 0; i < 75; i++){
                            recommendations.push(DS.createRecord('recommendation', {
                                timeStamp: new Date(),
                                decision: 'Recommendation_Decision_' + i.toString(),
                                assessmentTest: randomId('assessmentTest'),
                                treatment: randomId('treatment')
                            }));
                        }

                        var completedInjuryForms = [];
                        modelLists.push(completedInjuryForms);
                        modelIds.push({name: 'completedInjuryForm', list: []});

                        for(var i = 0; i < 50; i++){
                            completedInjuryForms.push(DS.createRecord('completedInjuryForm', {
                                date: new Date(),
                                injuryForm: randomId('injuryForm')
                            }));
                        }
                    }
                    else if(iteration == 4){
                        console.log('Done fourth iteration.');
                        var injuryResults = [];
                        modelLists.push(injuryResults);
                        modelIds.push({name: 'injuryResult', list: []});

                        for(var i = 0; i < 30; i++){
                            injuryResults.push(DS.createRecord('injuryResult', {
                                questionText: 'InjuryResult_QuestionText_' + i.toString(),
                                answer: 'InjuryResult_Answer_' + i.toString(),
                                completedInjuryForm: randomId('completedInjuryForm')
                            }));
                        }
                    }
                    else{
                        console.log('Done fifth iteration.');
                        return;
                    }
                    
                    // Clear the collection of model id's
                    for(var i = 0; i < modelIds.length; i++){
                        modelIds[i].list = [];
                    }
                    return saveFunc(0, 0);
                }
            }

            var iteration = 0;
            var modelLists = [];    // data to be posted to Ember
            var modelNames = [];    // model names
            var modelIds = [];      // list of already saved model names with their list of id's
            
            var countries = [];
            modelLists.push(countries);
            modelIds.push({name: 'country', list: []});

            for(var i = 0; i < 10; i++){
                countries.push(DS.createRecord('country', {
                    name: 'Country_Name_' + i.toString()
                }));
            }

            var provinces = [];
            modelLists.push(provinces);
            modelIds.push({name: 'province', list: []});

            for(var i = 0; i < 25; i++){
                provinces.push(DS.createRecord('province', {
                    name: 'Province_Name_' + i.toString()
                }));
            }
            
            var cities = [];
            modelLists.push(cities);
            modelIds.push({name: 'city', list: []});
            
            for(var i = 0; i < 35; i++){
                cities.push(DS.createRecord('city', {
                    name: 'City_Name_' + i.toString()
                }));
            }

            var genders = [];
            modelLists.push(genders);
            modelIds.push({name: 'gender', list: []});

            for(var i = 0; i < 5; i++){
                genders.push(DS.createRecord('gender', {
                    name: 'Gender_Name_' + i.toString()
                }));
            }

            var administrators = [];
            modelLists.push(administrators);
            modelIds.push({name: 'administrator', list: []});
            
            for(var i = 0; i < 3; i++){
                administrators.push(DS.createRecord('administrator', {
                    familyName: 'Administrator_FamilyName_' + i.toString(),
                    givenName: 'Administrator_GivenName_' + i.toString(),
                    email: 'Administrator_Email_' + i.toString(),
                    dateHired: new Date(),
                    dateFinished: new Date()
                }));
            }

            var physiotherapists = [];
            modelLists.push(physiotherapists);
            modelIds.push({name: 'physiotherapist', list: []});

            for(var i = 0; i < 10; i++){
                physiotherapists.push(DS.createRecord('physiotherapist', {
                    familyName: 'Physiotherapist_FamilyName_' + i.toString(),
                    givenName: 'Physiotherapist_GivenName_' + i.toString(),
                    email: 'Physiotherapist_Email_' + i.toString(),
                    dateHired: new Date(),
                    dateFinished: new Date()
                }));
            }

            var questionTypes = [];
            modelLists.push(questionTypes);
            modelIds.push({name: 'questionType', list: []});

            var questionTypeNames = ['t/f', 'textField', 'onetoten'];

            for(var i = 0; i < 3; i++){
                questionTypes.push(DS.createRecord('questionType', {
                    name: questionTypeNames[i]
                }));
            }

            saveFunc(0, 0)
            .then(function(){
                alert('Done creating all data!');
            }).catch(function(err){
                alert(err);
            });
        }
    }
});