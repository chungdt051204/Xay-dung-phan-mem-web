const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roleshcema = new Schema({
    User: {
        type: Number,
        default: 2001
    },
    Admin: Number,
})

module.exports = mongoose.model('Role',Roleshcema);