/**
 * Created by zsiri on 2016.12.08..
 */

import {Document, Schema, model} from 'mongoose';
import {Question} from "../app/questions";

export interface AskedQuestion {
    createdAt: Date,
    answeredAt: Date,
    question: Question
};

export interface AskedQuestionDocument extends AskedQuestion, Document {};

var askedQuestionSchema = new Schema({
    createdAt: {type: Date, default: Date.now() },
    answeredAt: Date,
    question: Schema.Types.Mixed,
});

export var AskedQuestionModel = model<AskedQuestionDocument>("AskedQuestion", askedQuestionSchema);
