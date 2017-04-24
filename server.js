const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use((req, res, next)=>{
	express.static(__dirname + "/public");
	next();
});


io.on('connection',(client)=>{
	console.log("client connected");
	client.on("join",(name)=>{
		client.nickname = name;
		client.broadcast.emit(name + ' has joined the chat');
	});

	io.on('messages',(message)=>{
		client.broadcast.emit('message', client.nickname + ':' + message);

		client.emit('message', client.nickname + ':' + message);
	});
});



app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});


server.listen(1337,()=>{console.log('listening port 1337');});