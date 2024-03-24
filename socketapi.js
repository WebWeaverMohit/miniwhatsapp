const message = require("./routes/message");
const userModel = require('./routes/users')
const messageModel = require('./routes/message')

const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
     
    socket.on('join-server', async username =>{
        await userModel.findOneAndUpdate({
            username
        },{
            socketId: socket.id
        })
    })

    socket.on('send-private-message', async messageObject =>{
        await messageModel.create({
            receiver: messageObject.receiver,
            sender: messageObject.sender,
            data: messageObject.message
        })
        const receiver = await userModel.findOne({
            username: messageObject.receiver
        })
        socket.to(receiver.socketId).emit('receive-private-message', messageObject)
    })
});
// end of socket.io logic

module.exports = socketapi;
