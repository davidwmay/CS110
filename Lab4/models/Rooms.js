const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

// var person = prompt("Please enter your name", "Harry Potter");

// if (person != null) {
//   document.getElementById("demo").innerHTML =
//   "Hello " + person + "! How are you today?";
// }

module.exports = Item = mongoose.model('room', RoomSchema);