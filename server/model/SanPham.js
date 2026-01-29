const mongoose = require('mongoose');
const { Schema } = mongoose;

const SanPhamSchema = new Schema({
    TenSanPham: {
        type: String,
        required: true
    },

    Gia:{
        type: Number,
        default: 0
    },

    MoTa: {
        type: String,
        required: true
    },

    ThongSoKyThuat: {
        type: String,
        default: ""
    },

    AnhThumbNail: {
        type: String,
        default: ""
    },

    TonKho: {
        type: Number,
        required: true
    },

    TrangThai: {
        type: Boolean,
        required:true,
        default: true
    },

    Hang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hang",
        required: true
    },

    LoaiThietBi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoaiThietBi",
        required: true
    },

    MauSac: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MauSac",
            required: true
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("SanPham", SanPhamSchema);
