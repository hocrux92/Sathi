const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const contactSchema =new Schema({
    // email: {
    //     type: String //This is the property for the type email in the contact.handlebars file
    // },
    name: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports =mongoose.model('Contact',contactSchema);