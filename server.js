
const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const IP = require('./utils/messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers
} = require('./utils/users');
const { time } = require('console');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Server' 

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
    
        
        
        //Welcome current user

        
        socket.join(user.room);
     
        //Welcome current user
        socket.emit('message', formatMessage(`${botName} : `, 'Welcome to Yaku!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message', 
                formatMessage(`${botName} : `,` A ${user.username} has joined the chat`)
            
            );
            
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room) 
            });    
        });



    //Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        
        
        io.to(user.room).emit('message', formatMessage(`${user.username} : `, msg));
        });
    
     //Runs when client disconnects
     socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit
            ('message', 
            formatMessage(`${botName} : `, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
                
            });
        }
    });
});

const PORT = 8080 || process.env.PORT;
const HOST = '192.168.0.8'
server.listen(PORT, HOST, () => console.log(`Server is online and running on port ${PORT} `))

