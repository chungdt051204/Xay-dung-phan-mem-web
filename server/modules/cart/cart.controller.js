const cartEntity = require("../../model/cart.model");
const productEntity = require("../../model/product.model");

//Hàm lấy giỏ hàng người dùng
exports.getCart = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const cart = await cartEntity
      .findOne({ userId })
      .populate("items.productId");
    if (cart !== null) return res.status(200).json({ result: cart });
    return res
      .status(404)
      .json({ message: "Không tìm thấy giỏ hàng của người dùng này" });
  } catch (error) {
    return res.status(500).json("Lỗi hệ thống", error.message);
  }
};

//Hàm thêm sản phẩm vào giỏ hàng
exports.addCart = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    const product = await productEntity.findOne({ _id: productId });
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    if (quantity < 0)
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    if (quantity > product.quantityStock)
      return res.status(400).json({ message: "Vượt quá số lượng tồn kho" });
    const existingCart = await cartEntity.findOne({ userId });
    if (!existingCart) {
      await cartEntity.create({ userId, items: [{ productId, quantity }] });
      return res
        .status(200)
        .json({ message: "Thêm 1 sản phẩm mới vào giỏ hàng thành công" });
    } else {
      const existingItem = await cartEntity.findOne({
        userId,
        "items.productId": productId,
      });
      if (!existingItem) {
        await cartEntity.updateOne(
          { userId },
          { $addToSet: { items: { productId, quantity } } }
        );
        return res
          .status(200)
          .json({ message: "Thêm 1 sản phẩm mới vào giỏ hàng thành công" });
      } else {
        await cartEntity.updateOne(
          { userId, "items.productId": productId },
          { $inc: { "items.$.quantity": quantity } }
        );
        return res.status(200).json({
          message: "Thêm số lượng sản phẩm này vào giỏ hàng thành công",
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm cập nhật số lượng sản phẩm
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { id } = req.params;
    const { action } = req.query;
    if (!action)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    await cartEntity.updateOne(
      { userId, "items._id": id },
      { $inc: { "items.$.quantity": action === "increase" ? 1 : -1 } }
    );
    return res
      .status(200)
      .json({ message: "Cập nhật số lượng sản phẩm thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm xóa item ra khỏi giỏ hàng người dùng
exports.deleteCartItem = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { id } = req.params;
    await cartEntity.updateOne({ userId }, { $pull: { items: { _id: id } } });
    return res
      .status(200)
      .json({ message: "Đã xóa 1 sản phẩm ra khỏi giỏ hàng thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

//Hàm xóa các item được chọn ra khỏi giỏ hàng người dùng
exports.deleteCartItemSelected = async (req, res) => {
  try {
    const userId = req.payload.sub;
    const { itemIds } = req.body;
    if (itemIds?.length <= 0)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin" });
    await cartEntity.updateOne(
      { userId },
      { $pull: { items: { _id: { $in: itemIds } } } }
    );
    return res.status(200).json({
      message: `Đã xóa ${itemIds.length} sản phẩm ra khỏi giỏ hàng thành công`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
