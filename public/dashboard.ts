/**
 * Created by zsiri on 2016.12.15..
 */

var socket = io();

$(document).ready(() => {
    socket.emit('login-dashboard');
});

socket.on('feedback', (data) => {
    console.log('feedback', data);

    var children = $("#userList").children().toArray();
    var isThere = false;
    for(let child of children){
        var $child = $(child);
        if($child.data("hashKey") == data.user.hashKey){
            isThere = true;

            $child.find(".hash").text(data.user.hashKey);
            $child.find(".name").text(data.user.name);
            $child.find(".highestStreak").text(data.highestStreak);
            $child.find(".currectStreak").text(data.currentStreak);
            $child.find(".correctSum").text(data.correctSum);
            $child.find(".wrongSum").text(data.wrongSum);
            $child.find(".correctsLength").text(data.corrects.length);
        }
    }

    if(!isThere){
        var $newChild = $("<div>")
            .addClass("user")
            .data("hashKey", data.user.hashKey);
        $newChild.append($("<div>").addClass("user-data").addClass("hash").text(data.user.hashKey));
        $newChild.append($("<div>").addClass("user-data").addClass("name").text(data.user.name));
        $newChild.append($("<div>").addClass("user-data").addClass("highestStreak").text(data.highestStreak));
        $newChild.append($("<div>").addClass("user-data").addClass("currectStreak").text(data.currentStreak));
        $newChild.append($("<div>").addClass("user-data").addClass("correctSum").text(data.correctSum));
        $newChild.append($("<div>").addClass("user-data").addClass("wrongSum").text(data.wrongSum));
        $newChild.append($("<div>").addClass("user-data").addClass("correctsLength").text(data.corrects.length));

        $("#userList").append($newChild);
    }
});

