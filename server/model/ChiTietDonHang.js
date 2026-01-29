const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChiTietDonHangSchema = new Schema({
    DonHang: {
        type: Schema.Types.ObjectId,
        ref: "DonHang",
        required: true
    },

    SanPham: {
        type: Schema.Types.ObjectId,
        ref: "SanPham",
        required: true
    },

    TenSanPham: {
        type: String,
        required: true
    },

    SoLuong: {
        type: Number,
        required: true,
        min: 1,
        required:true
    },

    DonGia: {
        type: Number,
        required: true,
        min: 0,
        required:0
    },

    ThanhTien: {
        type: Number,
        required: true,
        min: 0,
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model("ChiTietDonHang", ChiTietDonHangSchema);
