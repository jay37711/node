const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const hostname = '0.0.0.0';
const server = app.listen(port, hostname, () =>
  console.log(`server is running on port ${port}`)
);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketconnected = new Set();
var userDetailsArray = [];

io.on("connection", onConnected);
function onConnected(socket) {

    socketconnected.add(socket.id);
    io.emit('client-total', socketconnected.size);

    socket.on('disconnect', () => {
        userDetailsArray = userDetailsArray.filter(function(user) {
          return user.socket_id !== socket.id;
        });
        io.emit('user-details', userDetailsArray);
        socketconnected.delete(socket.id);
        io.emit('client-total', socketconnected.size);
        io.emit('user-details', userDetailsArray);
    });
    
    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message',data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })

    socket.on('authentication', (data) => {
      if(data.password == 12345){
        data.socket_id = socket.id;
        userDetailsArray.push(data);
        io.emit('user-details', userDetailsArray);
        console.log(userDetailsArray)
      }else{
        socket.disconnect();
      }
    })
}
