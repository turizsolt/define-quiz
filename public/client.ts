/**
 * Created by zsiri on 2016.12.05..
 */

import {Question} from "../app/questions";

var socket = io();

function getQuestion(){
    socket.emit('get-question');
};

socket.on('get-question', function(question:Question){
    //$('#questionHolder').text(JSON.stringify(question, null, 2));

    if(question.type === "multiple-answers" ||
        question.type === "single-answer"){

        var $maq = $("#multipleAnswerQuestion");
        $maq.empty();

        var $q = $("<div>").addClass("question");
        $q.text(question.question);
        $maq.append($q);

        for(let answer of question.answers){
            var $a = $("<div>").addClass("answer");
            $a.text(answer.answer);
            $a.on("click", function(e){
                var $this = $(this);
                if($this.hasClass("selected")){
                    $this.removeClass("selected");
                } else {
                    $this.addClass("selected");
                }
            });
            $maq.append($a);
        }
    } else if (question.type === "ordering") {

    } else if (question.type === "pairing") {

    }

});
