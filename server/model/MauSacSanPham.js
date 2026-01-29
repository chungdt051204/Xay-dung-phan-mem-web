const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MauSacSanPhamSchema = new Schema({
    sanPham: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SanPham',
        required: true
    },
    mauSac: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MauSac',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('MauSacSanPham', MauSacSanPhamSchema);
