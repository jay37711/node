const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const hostname = '0.0.0.0';
const server = app.listen(port, hostname, () =>
  console.log(`server is running on port ${port}`)
);
const io = require("socket.io")(server);
const socketHandler = require("./sockets/socket")(io); // Import the socket handler
const apiRoutes = require('./routes/api'); // Import API routes
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Use API routes
app.use('/api', apiRoutes);
