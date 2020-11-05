// Load Mongoose Modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    facebook: {
        type: String
    },
    google: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    image: {
        type: String,
        default: '/image/userlogo.jpg'
    },
    email: {
        type: String
    },
    date: {
        type: String,
        default: Date.now
    }
});

// Mongoose Modules to define the user schema We have a function for that thst is models

module.exports = mongoose.model('User',userSchema); 