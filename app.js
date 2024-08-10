
const port = 3000;
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');

const io = socketIo(server);

//Run when client connects
io.on('connection',(socket)=>{
    console.log('New WS connection')
})

//Set static folder
app.use(express.static(path.join(__dirname,'public')));



server.listen(port,(err)=>{
    if(err){
        console.log(err.message);
    }
    else{
        console.log("Server created successfully");
    }
})