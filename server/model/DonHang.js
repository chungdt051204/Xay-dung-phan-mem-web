const mongoose = require("mongoose");
const { Schema } = mongoose;

const DonHangSchema = new Schema({
    KhachHang: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    MaKhuyenMai: {
        type: Schema.Types.ObjectId,
        ref: "MaKhuyenMai",
        default: null
    },
    PhuongThucThanhToan: {
        type: String,
        enum: ["MoMo", "COD", "ZaloPay", "Cash"],
        required: true
    },

    NgayGiaoDich: {
        type: Date,
        default: Date.now
    },

    DiaChiGiaoHang: {
        type: String,
        required: true,
        trim: true
    },

    TongTien: {
        type: Number,
        required: true,
        min: 0
    },

    TrangThai: {
        type: String,
        enum: ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã xác nhận","Đã hủy"],
        default: "cho_xac_nhan"
    },

    TinhTrangThanhToan: {
        type: String,
        enum: ["Chưa thanh toán", "Đã thanh toán"],
        default: "chua_thanh_toan"
    },
    GhiChu: {
       type: String,
       default: ""
    }
    
}, { timestamps: true });

module.exports = mongoose.model("DonHang", DonHangSchema);
