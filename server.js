const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const { isObject } = require('util');
const formatMessage= require('./utils/messages.js');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users.js');
const admin="Admin ";

const app=express();
const server=http.createServer(app);
const io=socketio(server);
//set static folder
app.use(express.static(path.join(__dirname,'public' )));

//run when client connect
io.on('connection',socket =>{

    socket.on('joinRoom',({username,room})=>{
         
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(admin,'welcome to TalkSphere'));
    
        socket.broadcast.to(user.room).emit('message',formatMessage(admin,`${user.username} has connected`));

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        });
    })


    // io.emit()

    //listen for chat message 
    socket.on('chatMessage',(msg) =>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage((user.username+' '),msg));
    })
     

    socket.on('disconnect',() => {
        const user=userLeave(socket.id);
        if(user)
        {
            io.to(user.room).emit('message',formatMessage(admin,`${user.username} has left`));
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT=3000 || process.env.PORT;

server.listen(PORT,() => console.log(`server running at port ${PORT}`));