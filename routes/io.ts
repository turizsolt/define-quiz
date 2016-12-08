/**
 * Created by zsiri on 2016.12.05..
 */

import {Questions} from "../app/questions";
import {UserModel} from "../models/user";
import * as async from "async";
import ErrnoException = NodeJS.ErrnoException;

var questions = Questions.getInstance();

export function defineIoInteractions(io) {

    // define io interactions
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('login', (data: {name: string}) => {
            UserModel.create({name: data.name, hashKey: getNewHashKey(16)}, (err, userCreated)=>{
                if(err){
                    socket.emit('error');
                } else {
                    console.log("["+data.name + "] has logged in.");
                    socket.emit('login', userCreated);
                }
            });
        })

        socket.on('get-question', function(data: {hashKey: string}){
            async.waterfall([
                (cb) => {
                    UserModel.findOne({hashKey: data.hashKey}, (err, user) => {
                        if (err) {
                            cb(err);
                        } else if (!user) {
                            cb('auth error');
                        } else {
                            cb(null, user);
                        }
                    });
                },
                (user, cb) => {
                    questions.getRandomQuestion((err, q, aq) => {
                        if(err){
                            cb(err);
                        } else {
                            cb(null, user, q, aq);
                        }
                    });
                },
                (user, question, askedQuestion, cb) => {
                    user.questions.push(askedQuestion);
                    user.save((err, userCreated) => {
                        if(err){
                            cb(err);
                        } else {
                            cb(null, question);
                        }
                    });
                }
            ], (err, question) => {
                if(err){
                    console.log(JSON.stringify(err));
                    socket.emit('error');
                } else {
                    socket.emit('get-question', question);
                }
            });
        });

        socket.on('answer-question', function(data){
            console.log('Answer: ', data);
            questions.checkAnswer(data, (err, mergedQuestion)=>{
                if(err){
                    socket.emit('error');
                } else {
                    socket.emit('answer-question', mergedQuestion);
                    getFeedBack(data.hashKey, (err, feedback)=>{
                        if(err){
                            console.log('error', err);
                            socket.emit('custom-error');
                        } else {
                            socket.emit('feedback', feedback);
                        }
                    });
                }
            });
        });
    });

    return io;
}

function getNewHashKey(len: number):string {
    var validChars = "0123456789abcdefgijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var ret:string = "";

    for(let i=0;i<len;i++){
        var r = Math.random()*validChars.length|0;
        ret += validChars[r];
    }

    return ret;
}

function getFeedBack(hashKey:string, callback:Callback<any>):void {
    UserModel.findOne({hashKey: hashKey}).populate("questions").exec((err, user) => {
        if(err){
            callback(err);
        } else if(!user) {
            callback({name: "auth error", message: "auth error"});
        } else {
            var corrects = [];
            var correctSum = 0;
            var wrongSum = 0;
            var currentstreak = 0;
            var highestStreak = 0;
            for(let question of user.questions){
                var correct = (question.summary) ? question.summary.correct : false;
                corrects.push(correct);
                if(correct){
                    currentstreak++;
                    highestStreak = Math.max(currentstreak, highestStreak);
                    correctSum++;
                } else {
                    currentstreak = 0;
                    wrongSum++;
                }
            }
            callback(null, {
                feedBack: "ok",
                corrects: corrects,
                currentStreak: currentstreak,
                highestStreak: highestStreak,
                correctSum: correctSum,
                wrongSum: wrongSum
            });
        }
    });
}
