const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaoHanhSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    ChiTiet: {
        type: Schema.Types.ObjectId,
        ref: 'ChiTietDonHang',
        required: true
    },
    ThoiLuong: String,

    NgayBatDau: {
        type: Date,
        required: true
    },

    NgayHet: {
        type: Date,
        required: true
    },

    TrangThai: {
        type: Boolean,
        required: true
    },

    GhiChu: String
}, { timestamps: true });

module.exports = mongoose.model('BaoHanh', BaoHanhSchema);
