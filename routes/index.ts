import {Questions} from "../app/questions";
/**
 * Created by zsiri on 2016.12.05..
 */

var async = require('async');
var questions = Questions.getInstance();

export function defineRoutes(router) {

    router.get('/', function(req, res) {
        res.send(questions.getRandomQuestion());
    });

    return router;
}
