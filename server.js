const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();

let connectedUsers = [];

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (client)=>{

	client.on("join",(name)=>{
		
		client.nickname = name || randomNickname();
		const time = postingTime();
		client.broadcast.emit("message",'['+ time + ']: ' + client.nickname + ' has joined the chat');
		client.broadcast.emit('userJoined', client.nickname);

		connectedUsers.push(client.nickname);
		for(let i = 0; i < connectedUsers.length; i++){
		client.emit('userJoined', connectedUsers[i]);
		}

		let Posts = redisClient.lrange('chatlog', [0, 9],(err, reply)=>{
			while(reply.length){
				client.emit('message', reply.pop());
			}
		});
	});

	client.on("sendingMsg", (message)=>{
		const time = postingTime();
		const output = '['+ time + '] ' + client.nickname + ': ' + message;
		client.broadcast.emit('message', output);
		client.emit('message', output);

		let date = new Date();
		date = date.toDateString();

		redisClient.lpush('chatlog', date + " " + output, ()=>{
			console.log(date + output);
			redisClient.ltrim('chatlog', [0, 10000]);
		});
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

function randomNickname(){
	const NAMES = [
		'Beat PunchBeef',
		'Big, Brave Brick of Meat',
		'Big McLargeHuge',
		'Blast HardCheese',
		'Blast ThickNeck',
		'Bob Johnson',
		'Bold BigFlank',
		'Bolt VanderHuge',
		'Brick HardMeat',
		'Buck PlankChest',
		'Buff DrinkLots',
		'Buff HardBack',
		'Butch DeadLift',
		'Crud BoneMeal',
		'Crunch ButtSteak',
		'Dirk HardPec',
		'Fist RockBone',
		'Flint IronStag',
		'Fridge LargeMeat',
		'Gristle McThornBody',
		'Hack BlowFist',
		'Lump BeefBroth',
		'Punch RockGroin',
		'Punch Side-Iron',
		'Punt SpeedChunk',
		'Reef BlastBody',
		'Roll Fizzlebeef',
		'Rip SteakFace',
		'Slab BulkHead',
		'Slab SquatThrust',
		'Slate Fistcrunch',
		'Slate SlabRock',
		'Smash LampJaw',
		'Smoke ManMuscle',
		'Splint ChestHair',
		'Stump BeefKnob',
		'Stump Chunkman',
		'Thick McRunFast',
		'Touch RustRod',
		'Trunk SlamChest',
		'Whip SlagCheek'
	];

	let name;

	do{
		name = NAMES[Math.floor(Math.random() * NAMES.length)];
	}while(connectedUsers.indexOf(name) !== -1 );

	return name;
}