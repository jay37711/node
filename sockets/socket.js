const moment = require('moment');
const authController = require('../controllers/authController');

let socketconnected = new Set();
var userDetailsArray = [];

module.exports = function(io) {
    io.on("connection", onConnected);

    function onConnected(socket) {
        socketconnected.add(socket.id);        
        socket.on('message', (data) => {
            const user = getCurrentUser(socket.id);
            if(user){
                io.to(user.roomName).emit("chat-message", formatMessage(user.name, data));
            } else {
                // Handle if user not found
            }
        });

        socket.on('feedback', (data) => {
            const user = getCurrentUser(socket.id);
            if(user){
                io.to(user.roomName).emit("feedback", data);
            } else {
                // Handle if user not found
            }
        });

        socket.on('authentication', (data) => {
            console.log(data)
                data.id = socket.id;
                userDetailsArray.push(data);
                socket.join(data.roomName);
                io.emit('user-details', userDetailsArray);
                io.to(data.roomName).emit("roomUsers", {
                    room: data.roomName,
                    users: getRoomUsers(data.roomName),
                });
        });

        socket.on('disconnect', () => {
            userDetailsArray = userDetailsArray.filter(function(user) {
                return user.socket_id !== socket.id;
            });
            io.emit('user-details', userDetailsArray);
            socketconnected.delete(socket.id);
            io.emit('client-total', socketconnected.size);
            io.emit('user-details', userDetailsArray);
        
            const data = userLeave(socket.id);
            if(data){
                io.to(data.roomName).emit("roomUsers", {
                    room: data.roomName,
                    users: getRoomUsers(data.roomName),
                });
            }
        });
    }

    function getCurrentUser(id) {
        return userDetailsArray.find(user => user.id === id);
    }

    function formatMessage(username, text) {
        return {
            username,
            text,
            time: moment().format('h:mm a')
        };
    }

    function getRoomUsers(room) {
        return userDetailsArray.filter(user => user.roomName === room);
    }

    function userLeave(id) {
        const index = userDetailsArray.findIndex(user => user.id === id);
        if (index !== -1) {
            return userDetailsArray.splice(index, 1)[0];
        }
    }
}
