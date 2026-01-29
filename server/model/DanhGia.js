const mongoose = require('mongoose');
const { Schema } = mongoose;

const DanhGiaSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    SanPham: {
        type: Schema.Types.ObjectId,
        ref: "SanPham",
        required: true
    },
    Rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        required:true
    },
    Comment: {
        type: String,
        trim: true
    },
    NgayDanhGia: {
        type: Date,
        default: Date.now,
        required:true
    },
    AdminPhanHoi: {
        type: String,
        trim: true,
        default: null
    },
    NgayPhanHoi: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("DanhGia", DanhGiaSchema);
