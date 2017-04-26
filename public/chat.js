
const socket = io.connect('http://localhost:1337');

socket.on('connect', ()=>{
	$(".chatlog").append("<li>Connected</li>");
	let nickname = prompt("Enter Nickname:", randomNickname());
	socket.emit("join", nickname);
});

socket.on('message', (message)=>{
	$(".chatlog").append("<li>" + message + "</li>");
});

socket.on('userJoined', (user)=>{
	$('.userList').append('<li class="user">' + user + '</li>');
});

socket.on('userDisconnect', (user)=>{
	$('.user').remove(':contains('+ user +')');
});

$('#sendBtn').on("click", ()=>{ 
	sendMessage();
});

$('#newMsg').on("keydown",(e)=>{
	if(e.key == "Enter") sendMessage();
});

function sendMessage(){
	socket.emit("sendingMsg", $('#newMsg').val());
	$('#newMsg').val("");
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
	 let name = NAMES[Math.floor(Math.random() * NAMES.length)];
	return name;
}