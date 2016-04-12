function divEscapedContentElement(message){
	return $("<div></div>").text(message);
}
function divSystemContentElement(message){
	return $("<div></div>").html("<i>"+message+"</i>");
}

function processUserInput(chatAPP,socket){
	var message =$("#send-message").val();
	var systemMessage;
	if(message.charAt(0) == "/"){
		systemMessage =chatAPP.processCommand(message);
		if(systemMessage){
			$("#messages").append(divSystemContentElement(systemMessage));
		}

	}else{
		chatAPP.sendMessage($("#room").text(),message);
		$("#messages").append(divEscapedContentElement(message));
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	}
	$("#send-message").val("")
}


var socket =io.connect();
$(document).ready(function(){
	var chatAPP =new Chat(socket);
	socket.on("nameResult",function(result){
		var message;
		if(result.success){
			message ='You are now konw as '+ result.name+ '.';
		}else{
			message =result.message;
		}
		$("#message").append(divSystemContentElement(message));
	});
	socket.on("joinResult",function(result){
		$("#room").text(result.room);
		$("#message").append(divSystemContentElement("room change."));
	})
	socket.on("message",function(message){
		var newElement =$("<div></div>").text(message.text);
		$("#message").append(newElement);

	})
	socket.on("rooms",function(rooms){
		$("#room-list").empty();
		for(var room in rooms){
			room =room.substring(1,room.length);
			if(room!=""){
				$("#room-list").append(divEscapedContentElement(room));
			}
		}
		$("#room-list div").on("click",function(){
			chatAPP.processCommand("/join" +$(this).text());
			$("#send-message").focus();
		})
	})

	setInterval(function(){
		socket.emit("rooms");
	}, 1000);

	$("#send-message").focus();
	$("#send-form").submit(function(){
		processUserInput(chatAPP,socket);
		return false;
	})

})