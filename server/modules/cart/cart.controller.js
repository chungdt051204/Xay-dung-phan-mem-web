const cartEntity = require("../../model/cart.model");

//Hàm lấy giỏ hàng người dùng
exports.getCart = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const myCart = await cartEntity
        .findOne({ userId: payload.sub })
        .populate("items.productId");
      return res.status(200).json({ result: myCart });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy giỏ hàng của người dùng" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm getCart",
      error: error.message,
    });
    return res.status(500).json({
      message: "Lấy dữ liệu giỏ hàng thất bại",
      error: error.message,
    });
  }
};

//Hàm thêm sản phẩm vào giỏ hàng
exports.addCart = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const userId = payload.sub;
      const { productId, quantity } = req.body;
      const myCart = await cartEntity.findOne({ userId });
      if (!myCart) {
        await cartEntity.create({
          userId,
          items: [{ productId, quantity }],
        });
        return res
          .status(200)
          .json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
      } else {
        const existingCartItem = await cartEntity.findOne({
          $and: [{ userId }, { "items.productId": productId }],
        });
        if (!existingCartItem) {
          await cartEntity.updateOne(
            { userId },
            //Dùng toán tử addToSet để thêm 1 phần tủ vào mảng nếu phần tử đó chưa tồn tại
            { $addToSet: { items: { productId, quantity } } }
          );
          return res
            .status(200)
            .json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
        } else {
          await cartEntity.updateOne(
            { userId, "items.productId": productId },
            // Ký hiệu $ dùng để trỏ đến phần tử đầu tiên trong mảng items được tìm thấy dựa vào điều kiện trên
            { $inc: { "items.$.quantity": quantity } }
          );
          return res.status(200).json({
            message: "Thêm số lượng sản phẩm này vào giỏ hàng thành công",
          });
        }
      }
    }
    return res.status(404).json({ message: "Bạn chưa đăng nhập" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm postCart",
      error: error.message,
    });
    return res.status(500).json({
      message: "Thêm sản phẩm vào giỏ hàng thất bại",
      error: error.message,
    });
  }
};

//Hàm cập nhật số lượng sản phẩm
exports.updateQuantity = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const userId = payload.sub;
      const { id } = req.params;
      const { action } = req.query;
      await cartEntity.updateOne(
        { userId, "items._id": id },
        //action = "decrease" thì giảm 1, ngược lại thì tăng 1
        { $inc: { "items.$.quantity": action === "decrease" ? -1 : 1 } }
      );
      return res.status(200).json({ message: "Cập nhật số lượng thành công" });
    }
    return res.status(404).json({
      message:
        "Không tìm thấy giỏ hàng người dùng để cập nhật số lượng sản phẩm",
    });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm putQuantity",
      error: error.message,
    });
    return res.status(500).json({
      message: "Cập nhật số lượng sản phẩm thất bại",
      error: error.message,
    });
  }
};

//Hàm xóa item ra khỏi giỏ hàng người dùng
exports.deleteCartItem = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const userId = payload.sub;
      const { id } = req.params;
      const result = await cartEntity.updateOne(
        { userId },
        { $pull: { items: { _id: id } } }
      );
      if (result.modifiedCount === 0)
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm để xóa" });
      return res.status(200).json({
        message: "Đã xóa 1 sản phẩm ra khỏi giỏ hàng thành công",
      });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy giỏ hàng người dùng để xóa" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm deleteCartItem",
      error: error.message,
    });
    return res.status(500).json({
      message: "Xóa sản phẩm thất bại",
      error: error.message,
    });
  }
};
exports.deleteCartItemSelected = async (req, res) => {
  try {
    const payload = req.payload;
    if (payload) {
      const userId = payload.sub;
      const { itemIds } = req.body;
      const result = await cartEntity.updateOne(
        { userId },
        { $pull: { items: { _id: { $in: itemIds } } } }
      );
      if (result.modifiedCount === 0)
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm để xóa" });
      return res.status(200).json({
        message: `Đã xóa ${itemIds?.length} ra khỏi giỏ hàng thành công`,
      });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy giỏ hàng người dùng để xóa" });
  } catch (error) {
    console.log({
      message: "Có lỗi xảy ra khi xử lý hàm deleteCartItemSelected",
      error: error.message,
    });
    return res.status(500).json({
      message: "Xóa sản phẩm được chọn thất bại",
      error: error.message,
    });
  }
};
