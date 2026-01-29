const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhuongThucThanhToanSchema = new Schema({
    PhuongThucThanhToan:{
        type:String,
        required:true
    }
},{ timestamps: true });

module.exports = mongoose.model('PhuongThucThanhToan', PhuongThucThanhToanSchema);