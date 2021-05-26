function pullMessages(request, response) {
    response.render('message', {message: request.params.message, timestamp: request.params.timestamp, room: request.params.room, user: request.params.user});
}

module.exports = {
    pullMessages
}; 