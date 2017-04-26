const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);


app.use(express.static(__dirname + "/public"));

app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (client)=>{


	client.on("join",(name)=>{
		client.nickname = name;
		const time = postingTime();
		client.broadcast.emit("message",'['+ time + ']: ' + name + ' has joined the chat');
		client.broadcast.emit('userJoined', client.nickname);
		client.emit('userJoined', client.nickname);
	});

	client.on("sendingMsg", (message)=>{
		const time = postingTime();
		client.broadcast.emit('message', '['+ time + '] ' + client.nickname + ': ' + message);
		client.emit('message', '['+ time + '] ' + client.nickname + ': ' + message);
	});

	client.on('disconnect', ()=>{
		client.broadcast.emit('userDisconnect', client.nickname);
	});
});


server.listen(1337,()=>{console.log('listening port 1337');});

function postingTime(){
	let time = new Date();
	time = time.toTimeString();
	return time.match(/\d+:\d+:\d+/)[0];
}