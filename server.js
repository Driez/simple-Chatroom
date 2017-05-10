const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();
const filter = require('./chatfilters/filters');
const randomNickname = require('./utils/randomName'); 

let connectedUsers = [];

app.use(express.static("public"));

app.get('/', (req, res)=>{
	res.sendFile('public/index.html');
});

io.on('connection', (client)=>{

	client.on("join",(name)=>{
		if(filter.username(name) && !(~connectedUsers.indexOf(name))){
			client.nickname = name || randomNickname(connectedUsers);
		}else{
			client.nickname = randomNickname(connectedUsers);
			client.emit('message', 'this Username is taken or against the rules. Random Name has been assigned');
		}
		const time = postingTime();
		client.broadcast.emit("message",'['+ time + ']: ' + client.nickname + ' has joined the chat');
		client.broadcast.emit('userJoined', client.nickname);

		connectedUsers.push(client.nickname);
		for(let i = 0; i < connectedUsers.length; i++){
		client.emit('userJoined', connectedUsers[i]);
		}

		const posts = redisClient.lrange('chatlog', [0, 9],(err, reply)=>{
			while(reply.length){
				client.emit('message', reply.pop());
			}
		});
	});

	client.on("sendingMsg", (message)=>{
		const time = postingTime();
		if(filter.badLanguage(message)){
			const output = '['+ time + '] ' + client.nickname + ': ' + message;
			client.broadcast.emit('message', output);
			client.emit('message', output);

			let date = new Date();
			date = date.toDateString();

			redisClient.lpush('chatlog', date + " " + output, ()=>{
				console.log(date + output);
				redisClient.ltrim('chatlog', [0, 10000]);
			});
		} else{
			client.emit('message', 'swearing is not allowed');
		}
	});

	client.on('disconnect', ()=>{
		client.broadcast.emit('userDisconnect', client.nickname);
		const time = postingTime();
		client.broadcast.emit("message",'['+ time + ']: ' + client.nickname + ' has disconnected');
		
		connectedUsers.splice(connectedUsers.indexOf(client.nickname),1);
	});
});


server.listen(1337,()=>{console.log('listening port 1337');});


function postingTime(){
	let time = new Date();
	time = time.toTimeString();
	return time.match(/\d+:\d+:\d+/)[0];
}
