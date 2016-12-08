/**
 * Created by zsiri on 2016.12.08..
 */

import {Document, Schema, model} from 'mongoose';
import {Question} from "../app/questionInterfaces";
import {AskedQuestionDocument} from "./askedQuestion";

export interface User {
    createdAt: Date,
    hashKey: string,
    questions: AskedQuestionDocument[],
    name: string
};

export interface UserDocument extends User, Document {};

var userSchema = new Schema({
    createdAt: {type: Date, default: Date.now() },
    hashKey: String,
    questions: [{type: Schema.Types.ObjectId, ref: 'AskedQuestion'}],
    name: String
});

export var UserModel = model<UserDocument>("User", userSchema);
