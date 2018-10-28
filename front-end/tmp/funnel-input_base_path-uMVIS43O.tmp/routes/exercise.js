import Route from '@ember/routing/route';
import fileObject from "../utils/file-object";
import { inject as service } from '@ember/service';

export default Route.extend({
    store: service(),
    router: service(),
    beforeModel(){
        if(this.get('oudaAuth').getRole() !== 'ph'){
            this.transitionTo('home');
        }
    },
    model() {
        var authentication = this.get('oudaAuth');
        var myStore = this.get('store');
        var exercisesJSON = [];
        return myStore.findAll('exercise', {reload: true})
        .then(function(exercises){
            exercises.forEach(function(exercise){
                var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                exerciseJSON.id = exercise.id;
                exercisesJSON.push(exerciseJSON);
            });
        }).then(function(){
            function findImages(index){
                if(index !== exercisesJSON.length){
                    return myStore.findRecord('image', exercisesJSON[index].image, {reload: true})
                    .then(function(image){
                        var imageJSON = JSON.parse(JSON.stringify(image));
                        imageJSON.id = image.id;
                        exercisesJSON[index].image = imageJSON;
                        return findImages(index + 1);
                    });
                }
                else{
                    return exercisesJSON;
                }
            }

            return findImages(0);
        }).catch(function(err){
            alert(err);
        });
    }
});