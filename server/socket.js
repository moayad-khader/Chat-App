const server=require('./server');
const sokectio=require('socket.io');
const Filter=require('bad-words');
const {generateMessage,
       generateLocationMessage }=require('./utils/messages');

const { adduser,
        removeUser,
        getUser,
        getUsersInRoom }=require('./utils/users');



const io=sokectio(server);

io.on('connection',(socket)=>{
    console.log('new webSocket connection')



    socket.on('join',({username,room},ack)=>{

        const {error,user}=adduser({id:socket.id,username,room});

        if(error){
            return ack(error);
        }


        socket.join(user.room);
        
        socket.emit('message',generateMessage('Welcome','Admin'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`,'Admin'));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)

        })

        ack();
    })

    socket.on('sendingMessage',(message,ack)=>{

        const user=getUser(socket.id);

        const filter=new Filter()

        if(filter.isProfane(message)){
            return ack('Profanity is not allowed')
        }

        io.to(user.room).emit('message',generateMessage(message,user.username))

        ack()
        
    })

    socket.on('disconnect',()=>{

        const user=removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',generateMessage('A user has left','Admin'));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            });
        }
        
    })

    socket.on('sendingLocation',(latitude,longitude,ack)=>{

        const user=getUser(socket.id);

        io.to(user.room).emit('renderLocation',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`,user.username));
        ack('Location shared');
    })
  
})

