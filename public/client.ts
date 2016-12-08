/**
 * Created by zsiri on 2016.12.05..
 */

import {Question} from "../app/questionInterfaces";

var socket = io();

var lastQuestion:Question = null;
var lastAnswers:JQuery[];

var hashKey:string = null;

var state = "nothing";
var autoGetQuestion = false;

function getQuestion(){
    if(state == "question"){
        console.log("getQuestion refused.");
        return;
    }
    if(!hashKey) return;
    state = "question";
    console.log("state", state);

    $("body").removeClass();
    socket.emit('get-question', {hashKey: hashKey});
};

function answerQuestion(){
    if(state != "question") {
        console.log("answerQuestion refused.");
        return;
    }

    state = "answer";
    console.log("state", state);

    var selected:number[] = [];

    for(let ind in lastAnswers){
        if(lastAnswers[ind].hasClass("selected")){
            selected.push(parseInt(ind, 10));
        }
    }
    socket.emit('answer-question', {askedId: lastQuestion.askedId, selected: selected, hashKey: hashKey});
};

function login(){
    var loginName:string = $("#loginName").val();
    //if(!loginName) return;
    //if(loginName.trim().split(" ").length < 2) return;
    $("#name").text(loginName);

    socket.emit('login', {name: loginName});
}

function setAuto(){
    autoGetQuestion = $("#autoQuestion").is(":checked");
    console.log("setAuto", autoGetQuestion);
    if(autoGetQuestion){
        getQuestion();
    }
}

socket.on('login', (data) => {
    console.log(data);
    hashKey = data.hashKey;
    $("#login").hide();
    $("#main").show();
});

socket.on('feedback', (data) => {
    console.log('feedback', data);

    let now = $("#currentStreak").children().length;
    for(let i=now;i<data.highestStreak;i++){
        let $streakBall = $("<div>").addClass("streak-ball").text(i+1);
        $("#currentStreak").append($streakBall);
    }

    if(data.currentStreak == 0){
        //$("#currentStreak").empty();
        console.log("cs0");
        $("#currentStreak").find(".streak-ball").removeClass("streak-ball").addClass("streak-ball-longest");
    } else {
        /*
        let now = $("#currentStreak").children().length;
        for(let i=now;i<data.currentStreak;i++){
            let $streakBall = $("<div>").addClass("streak-ball").text(i+1);

            if(i != 0 && i%20 == 0) $("#currentStreak").append($("<div>"));
            $("#currentStreak").append($streakBall);
        }
        */

        let now = $("#currentStreak").find(".streak-ball").length;
        let balls = $("#currentStreak").children();
        for(let i=now;i<data.currentStreak;i++){
            $(balls[i]).addClass("streak-ball").removeClass("streak-ball-longest");
        }

    }


    /*
    let now = $("#highestStreak").children().length;
    for(let i=now;i<data.highestStreak;i++){
        let $streakBall = $("<div>").addClass("streak-ball").addClass("streak-ball-longest").text(i+1);
        $("#highestStreak").append($streakBall);
    }
    */

    now = $("#answerList").children().length;
    for(let i=now;i<data.corrects.length;i++){
        let $streakBall = $("<div>").addClass("answer-ball-"+(data.corrects[i]?"correct":"wrong")).text(i+1);
        $("#answerList").append($streakBall);
    }

    $("#answerCorrectSum").text(data.correctSum);
    $("#answerWrongSum").text(data.wrongSum);
});

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

        var num = -1;
        for(let answer of question.answers){
            num++;
            var $a = $("<div>").addClass("answer");
            $a.text(num+": "+answer.answer);
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

    $(document).unbind("keypress");

    $(document).on("keypress", function(e) {
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        console.log('pressed: ', charCode);
        if(state != "question") return;
        console.log('processed: ', charCode);


        if(charCode > 47 && charCode < 52){
            var child = $("#multipleAnswerQuestion").children()[charCode-48+1];
            var $this = $(child);
            if($this.hasClass("selected")){
                $this.removeClass("selected");
            } else {
                $this.addClass("selected");
            }
        }

        if(charCode == 13 || charCode == 32){
            answerQuestion();
        }
    }) ;

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

    if(autoGetQuestion) setTimeout(() => {
        if(autoGetQuestion){
            getQuestion();
        }
    },1200);
});

function getClassByAns(ans){
    if(ans.right && ans.selected) return "correct";
    if(ans.right) return "missed";
    if(ans.selected) return "wrong";
    return "neutral";
}

