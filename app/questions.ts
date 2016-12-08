/**
 * Created by zsiri on 2016.12.05..
 */

import * as fs from "fs";
import * as deepcopy from "deepcopy";
import {AskedQuestionModel, AskedQuestionDocument} from "../models/askedQuestion";
import {Question, MultipleAnswerQuestion} from "./questionInterfaces";


export class Questions{
    private questions:Question[] = [];
    private static instance:Questions;

    private constructor(){
        var indexFiles = JSON.parse(fs.readFileSync("data/index.json", "utf-8"));

        for(let file of indexFiles.files){
            let additionalQuestions = JSON.parse(fs.readFileSync("data/"+file, "utf-8"));
            this.questions = this.questions.concat(additionalQuestions);
        }

        console.log(this.questions.length+" question(s) loaded from "+indexFiles.files.length+" module(s).");
    }

    public static getInstance():Questions {
        if(!Questions.instance){
            Questions.instance = new Questions();
        }
        return Questions.instance;
    }

    public getRandomQuestion(callback:Callback2<Question, AskedQuestionDocument>):void {
        var size:number = this.questions.length;
        var chosen:number = Math.random()*size|0;
        var question:Question = this.narrow(this.questions[chosen] as MultipleAnswerQuestion);

        AskedQuestionModel.create({question: question}, (err, createdQuestion) => {
            if(err){
                callback(err);
            } else {
                question = this.trimRightness(question  as MultipleAnswerQuestion);
                question.askedId = createdQuestion._id;
                callback(null, question, createdQuestion);
            }
        })
    }

    public checkAnswer(answer: any, callback:Callback<any>):void {
        AskedQuestionModel.findById(answer.askedId, (err, askedQuestion) => {
            if(err) {
                callback(err);
            } else {
                var mergedQuestion:any = deepcopy(askedQuestion.toObject());
                //console.log('merged', mergedQuestion);
                for(let sel of answer.selected){
                    mergedQuestion.question.answers[parseInt(sel, 10)].selected = true;
                }

                var correct:boolean = true;
                var right:number = 0;
                var misses:number = 0;
                var additional: number = 0;

                for(let answer of mergedQuestion.question.answers){
                    if(answer.right && answer.selected){
                        right++;
                    } else {
                        if(!answer.right && !answer.selected){
                            right++;
                        } else {
                            correct = false;

                            if(!answer.right){
                                additional++;
                            } else if(!answer.selected){
                                misses++;
                            }
                        }
                    }
                }

                mergedQuestion.correct = correct;
                mergedQuestion.summary = {
                    correct: correct,
                    right: right,
                    missies: misses,
                    additional: additional
                }

                askedQuestion.answerGiven = answer;
                askedQuestion.summary = mergedQuestion.summary;
                askedQuestion.save((err, savedAskedQuestion) => {
                    if(err){
                        callback(err);
                    } else {
                        callback(null, mergedQuestion);
                    }
                });

            }
        });

    }

    private narrow(question: MultipleAnswerQuestion):MultipleAnswerQuestion {
        var q:MultipleAnswerQuestion = deepcopy(question);

        shuffle(q.answers);
        q.answers = q.answers.slice(0,4);

        return q;
    }

    private trimRightness(question: MultipleAnswerQuestion):Question {
        for(let answer of question.answers){
            if(answer.right){
                delete answer.right;
            }
        }
        return question;
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
};
