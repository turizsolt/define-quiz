/**
 * Created by zsiri on 2016.12.05..
 */

import * as fs from "fs";
import * as deepcopy from "deepcopy";

export interface Answer {
    answer: string,
    right?: boolean
}

export interface Pair {
    left: string,
    right: string
}

export interface Element {
    element: string,
    hint: string
}

export type Question =
    MultipleAnswerQuestion |
    SingleAnswerQuestion |
    PairingQuestion |
    OrderingQuestion;

export interface MultipleAnswerQuestion {
    type: "multiple-answers",
    question: string,
    answers: Answer[]
}

export interface SingleAnswerQuestion {
    type: "single-answer",
    question: string,
    answers: Answer[]
}

export interface PairingQuestion {
    type: "pairing",
    question: string,
    seed?: {
        pairs: number,
        "left-alone": number,
        "right-alone": number
    },
    pairs: Pair[],
    "left-alone"?: string[],
    "right-alone"?: string[]
}

export interface OrderingQuestion {
    type: "ordering",
    question: string,
    elements:Element[]
}

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

    public static getInstance() {
        if(!Questions.instance){
            Questions.instance = new Questions();
        }
        return Questions.instance;
    }

    public getRandomQuestion():Question {
        var size:number = this.questions.length;
        var chosen:number = Math.random()*size|0;
        return this.narrow(this.questions[chosen] as MultipleAnswerQuestion);
    }

    private narrow(question: MultipleAnswerQuestion):Question {
        var q:MultipleAnswerQuestion = deepcopy(question);

        shuffle(q.answers);
        q.answers = q.answers.slice(0,4);

        return q;
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
