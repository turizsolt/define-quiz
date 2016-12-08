/**
 * Created by zsiri on 2016.12.05..
 */

import {Questions} from "../app/questions";

var questions = Questions.getInstance();

export function defineIoInteractions(io) {

    // define io interactions
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('get-question', function(){
            questions.getRandomQuestion((err, question) => {
                if(err){
                    socket.emit('error', err);
                } else {
                    socket.emit('get-question', question);
                }
            });

        });

        socket.on('answer-question', function(data){
            console.log('Answer: ', data);
            questions.checkAnswer(data, (err, mergedQuestion)=>{
                if(err){
                    socket.emit('error', err);
                } else {
                    socket.emit('answer-question', mergedQuestion);
                }
            });
        });
    });

    return io;
}
