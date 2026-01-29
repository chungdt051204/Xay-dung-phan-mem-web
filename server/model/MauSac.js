const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MauSacSchema = new Schema({
    TenMau: {                 
        type: String,
        required: true,
        trim: true
    },
    MaHex: {              
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('MauSac', MauSacSchema);
