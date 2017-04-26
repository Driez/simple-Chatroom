class chat{
	constructor(){
		this.socket = io.connect('http://localhost:1337');

		socket.on('connect', ()=>{
			$(".chatlog").append($("<li>Connected</li>"));
		});

		socket.on('message', (message)=>{
			$(".chatlog").append("<li>" + message + "</li>");
		});
	}

	listenButton(){
		$('#sendBtn').on("click", ()=>{ 
			const $inputField = $("#newMsg");
			this.socket.emit("messages", inputField.value());
			inputField.value("");
		});
	}

	listenEnter(){
		$('#newMsg').on("keydown",(e)=>{
			if(e.key == "Enter") this.socket.emit("messages", this.value());
		});
	}
}

