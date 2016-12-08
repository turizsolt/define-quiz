/**
 * Created by zsiri on 2016.12.05..
 */

import {Questions} from "../app/questions";
var questions = Questions.getInstance();

export function defineRoutes(router) {

    router.get('/', function(req, res) {
        res.sendFile('index.html');
    });

    router.get('/get', function(req, res) {
        questions.getRandomQuestion((err, question) => {
           if(err){
               res.send(err);
           } else {
               res.send(question);
           }
        });
    });

    return router;
}
