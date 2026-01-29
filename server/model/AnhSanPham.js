const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnhSanPhamshcema = new Schema({
    SanPham: {
        type: Schema.Types.ObjectId,
        ref: "SanPham",
        required: true
    },
    
    URLAnh:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('AnhSanPham',AnhSanPhamshcema);