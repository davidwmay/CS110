const roomGenerator = require('../util/roomIdGenerator.js');

// send = document.getElementById("sendButton")
// .addEventListener("click", function(){ alert("Hello World!"); });

// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response){
    response.render('room', {title: 'chatroom', roomName: request.params.roomName, newRoomId: roomGenerator.roomIdGenerator()});
}



module.exports = {
    getRoom
}; 