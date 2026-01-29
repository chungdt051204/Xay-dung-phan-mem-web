const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoaiThietBiSchema = new Schema({
    LoaiThietBi: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('LoaiThietBi', LoaiThietBiSchema);
