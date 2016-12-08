/**
 * Created by zsiri on 2016.12.05..
 */

import {Question} from "../app/questionInterfaces";

var socket = io();

var lastQuestion:Question = null;
var lastAnswers:JQuery[];

var state = "nothing";

function getQuestion(){
    if(state == "question") return;
    state = "question";

    $("body").removeClass();
    socket.emit('get-question');
};

function answerQuestion(){
    if(state != "question") return;
    state = "answer";

    var selected:number[] = [];

    for(let ind in lastAnswers){
        if(lastAnswers[ind].hasClass("selected")){
            selected.push(parseInt(ind, 10));
        }
    }
    socket.emit('answer-question', {askedId: lastQuestion.askedId, selected: selected});
};

socket.on('get-question', function(question:Question){
    //$('#questionHolder').text(JSON.stringify(question, null, 2));

    lastQuestion = question;
    lastAnswers = [];
    console.log(question);

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
            lastAnswers.push($a);
        }
    } else if (question.type === "ordering") {

    } else if (question.type === "pairing") {

    }

});

socket.on('answer-question', function(questionQ:{question: Question, correct: boolean}){
    var question:Question = questionQ.question;

    console.log(questionQ);

    if(question.type === "multiple-answers" ||
        question.type === "single-answer"){


        for(let ind in question.answers){
            let ans = question.answers[ind];

            lastAnswers[ind].removeClass();
            lastAnswers[ind].addClass("frozen");
            lastAnswers[ind].addClass(getClassByAns(ans));
        }

        if(questionQ.correct){
            $("body").addClass("body-correct");
        } else {
            $("body").addClass("body-incorrect");
        }

    } else if (question.type === "ordering") {

    } else if (question.type === "pairing") {

    }
});

function getClassByAns(ans){
    if(ans.right && ans.selected) return "correct";
    if(ans.right) return "missed";
    if(ans.selected) return "wrong";
    return "neutral";
}
