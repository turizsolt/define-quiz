/**
 * Created by zsiri on 2016.12.05..
 */

import * as fs from "fs";

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

export interface Question {
    type: string,
    question: string
}

export interface MultipleAnswerQuestion extends Question {
    type: "multiple-answers",
    answers: Answer[]
}

export interface SingleAnswerQuestion extends Question {
    type: "multiple-answers",
    answers: Answer[]
}

export interface PairingQuestion extends Question {
    type: "pairing",
    seed?: {
        pairs: number,
        "left-alone": number,
        "right-alone": number
    },
    pairs: Pair[],
    "left-alone"?: string[],
    "right-alone"?: string[]
}

export interface OrderingQuestion extends Question {
    type: "ordering",
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

    public getRandomQuestion():any {//Question {
        var size:number = this.questions.length;
        var chosen:number = Math.random()*size|0;
        return this.questions[chosen];
    }

}
