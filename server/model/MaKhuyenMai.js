const mongoose = require('mongoose');
const { Schema } = mongoose;

const MaKhuyenMaiSchema = new Schema({
    MaKhuyenMai: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    PhanTram: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    NgayBatDau: {
        type: Date,
        default: Date.now,
        required: true
    },

    NgayKetThuc: {
        type: Date,
        required: true
    },

    TrangThai: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('MaKhuyenMai', MaKhuyenMaiSchema);
