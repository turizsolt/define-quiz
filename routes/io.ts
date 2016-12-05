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
            socket.emit('get-question', questions.getRandomQuestion());
        });
    });

    return io;
}
