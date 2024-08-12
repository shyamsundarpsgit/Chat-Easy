const port = 3000;
const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const { formatMessage } = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");
const io = socketIo(server);
const botName = "ChatEasy Bot";
//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //Welcome Current User
    socket.emit("message", formatMessage(botName, "Welcome to ChatEasy"));

    //Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has Joined the chat`)
      );
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });

  //Runs when user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user left the chat"));
  });
});

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Server created successfully");
  }
});
