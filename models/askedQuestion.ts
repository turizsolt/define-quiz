/**
 * Created by zsiri on 2016.12.08..
 */

import {Document, Schema, model} from 'mongoose';
import {Question} from "../app/questionInterfaces";

export interface AskedQuestion {
    createdAt: Date,
    answeredAt: Date,
    question: Question,
    answerGiven: any,
    summary: any
};

export interface AskedQuestionDocument extends AskedQuestion, Document {};

var askedQuestionSchema = new Schema({
    createdAt: {type: Date, default: Date.now() },
    answeredAt: Date,
    question: Schema.Types.Mixed,
    answerGiven: Schema.Types.Mixed,
    summary: Schema.Types.Mixed
});

export var AskedQuestionModel = model<AskedQuestionDocument>("AskedQuestion", askedQuestionSchema);
