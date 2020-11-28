const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema= new Schema({
    owner: {
        type: Scshema.Types.ObjectId,
        ref: 'User'
    },
    make: {
        type: String
    },
    model: {
        type: String
    },
    year: {
        type:Number
    },
    type:{
        type:String
    },
    pricePerWeek: {
        type: Number
    },
    pricePerHour: {
        type: Number
    },
    location: [{
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    }],
    date: {
        type: Date,
        dafault: Date.now
    }
});
module.exports = mongoose.model('Car',carSchema);