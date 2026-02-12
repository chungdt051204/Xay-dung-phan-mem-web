const brand = require("../../model/brand.model");
const prodcutEntity = require("../../model/product.model");

exports.getBrands = async (req, res) => {
    try {
        const brands = await brand.find();
        res.status(200).json({ result: brands });
    } catch (error) {
        console.log("Lỗi ở hàm getProduct:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prodcutEntity.findOne({ brand: id });
        if (product) {
            return res.status(400).json({ message: "Không thể xóa thương hiệu vì có sản phẩm liên quan." });
        }
        await brand.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa thương hiệu thành công" });
    } catch (error) {
        console.log("Lỗi ở hàm deleteBrand:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.createBrand = async (req, res) => {
    try {
        const { brandName } = req.body;
        const newBrand = new brand({ brandName });
        await newBrand.save();
        res.status(201).json({ message: "Tạo thương hiệu thành công", brand: newBrand });
    } catch (error) {
        console.log("Lỗi ở hàm createBrand:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const { id, brandName } = req.body;
        const updatedBrand = await brand.findByIdAndUpdate(id, { brandName }, { new: true });
        res.status(200).json({ message: "Cập nhật thương hiệu thành công", brand: updatedBrand });
    } catch (error) {
        console.log("Lỗi ở hàm updateBrand:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};