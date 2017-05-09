
const socket = io.connect('http://localhost:1337');

socket.on('connect', ()=>{
	let nickname = prompt("Enter Nickname:");
	$(".chatlog").append("<li>Connected</li>");
	socket.emit("join", nickname);
});

socket.on('message', (message)=>{
	const date = new Date();
	const regExp = new RegExp('^' + date.toDateString() +' ');
	console.log(message);
	if(!!message.match(regExp)) message = message.replace(regExp, '');
	$(".chatlog").append("<li>" + message + "</li>");
});

socket.on('userJoined', (user)=>{
	$('.userList').append('<li class="user">' + user + '</li>');
});

socket.on('userDisconnect', (user)=>{
	$('.user').remove(':contains('+ user +')');
});

$('#sendBtn').on("click", ()=>{ 
	if($('#newMsg').val() !== "") sendMessage();
});

$('#newMsg').on("keydown",(e)=>{
	if(e.key == "Enter" && $('#newMsg').val() !== "") sendMessage();
});

function sendMessage(){
	socket.emit("sendingMsg", $('#newMsg').val());
	$('#newMsg').val("");
}

