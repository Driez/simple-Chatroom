
const socket = io.connect('http://localhost:1337');

socket.on('connect', ()=>{
	$(".chatlog").append("<li>Connected</li>");
	let nickname = prompt("Enter Nickname:");
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

