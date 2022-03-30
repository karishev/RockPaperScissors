//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);

//Initialize socket.io  
//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let players = {amount: 0, ids: []};
let emojis = ['','']

//when cline tries to connect to the server
io.sockets.on('connect', (socket)=> {
    players.amount++;
    players.ids.push(socket.id);
    io.sockets.emit('players', players);

    socket.on('emojis', (emoji)=> {
        emojis[emoji.id] = emoji.emoji
        console.log(emoji)
        io.sockets.emit('emojis', emojis);

    })

    socket.on('end', () => {
        emojis = ['','']
    })
    
    socket.on('disconnect', () => {
        console.log('goodbye,', socket.id)
        let id = players.ids.indexOf(socket.id);
        players.ids.splice(id, 1);
        players.amount--;
        io.sockets.emit('players', players);
    })
})


//run the createServer
let port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});
