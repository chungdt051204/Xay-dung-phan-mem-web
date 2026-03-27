const orderEntity = require("../../model/order.model");
const productEntity = require("../../model/product.model");
const cartEntity = require("../../model/cart.model");
const crypto = require("crypto");
const axios = require("axios");

// Get all orders with pagination
exports.getOrder = async (req, res) => {
  try {
    const arrayOrders = await orderEntity.find();
    const {
      _page = 1,
      _limit = arrayOrders?.length,
      orderId,
      userId,
      status,
      paymentStatus,
    } = req.query;

    let query = {};
    const options = {
      page: _page,
      limit: _limit,
      sort: { createdAt: -1 },
    };
    if (orderId) {
      const order = await orderEntity
        .findOne({ _id: orderId })
        .populate("items.productId");
      return res.status(200).json({ result: order });
    }
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await orderEntity.paginate(query, options);
    return res.status(200).json({ result: orders });
  } catch (error) {
    console.log("Error in getOrder:", error.message);
    return res.status(500).json({ message: "Lấy danh sách đơn hàng thất bại" });
  }
};

// Get order by ID with items
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity
      .findById(id)
      .populate("userId")
      .populate("couponId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const orderItems = await orderItemsEntity
      .find({ orderId: id })
      .populate("productId");

    return res
      .status(200)
      .json({ result: { ...order.toObject(), items: orderItems } });
  } catch (error) {
    console.log("Error in getOrderById:", error.message);
    return res.status(500).json({ message: "Lấy thông tin đơn hàng thất bại" });
  }
};

// Create new order
exports.postOrder = async (req, res) => {
  try {
    if (!req.payload)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xử lý đơn hàng" });
    const userId = req.payload.sub;
    const { fullname, address, phone, paymentMethod, items, total } = req.body;

    // Kiểm tra số lượng sản phẩm có sẵn
    for (const item of items) {
      const product = await productEntity.findById(item.productId._id);
      if (!product) {
        return res.status(404).json({
          message: `Sản phẩm ${item.productId.productName} không tồn tại`,
        });
      }
      if (product.quantityStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.productName} chỉ còn ${product.quantityStock} cái. Bạn không thể đặt ${item.quantity} cái`,
        });
      }
    }
    let arrayItems = [];
    if (items?.length > 0) {
      items.forEach((value) => {
        arrayItems.push({
          productId: value.productId._id,
          quantity: value.quantity,
          price: value.productId.price,
          amount: value.productId.price * value.quantity,
        });
      });
    }

    // Create order
    const newOrder = await orderEntity.create({
      userId,
      fullname,
      address,
      phone,
      paymentMethod,
      totalAmount: total,
      items: arrayItems,
    });
    //Xóa các item được chọn ra khỏi giỏ hàng
    const itemIds = items?.map((value) => value._id);
    await cartEntity.updateOne(
      { userId },
      { $pull: { items: { _id: { $in: itemIds } } } }
    );
    if (paymentMethod === "cod") {
      // Trừ số lượng sản phẩm trong kho
      for (const item of items) {
        await productEntity.findByIdAndUpdate(item.productId._id, {
          $inc: { quantityStock: -item.quantity },
        });
      }
      return res.status(200).json({ message: "Đặt hàng thành công" });
    }
    if (paymentMethod === "online") {
      var partnerCode = "MOMO";
      var accessKey = "F8BBA842ECF85";
      var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      var requestId = partnerCode + new Date().getTime();
      var orderId = newOrder?._id;
      var orderInfo = `Thanh toán cho đơn hàng + ${newOrder?._id}`;
      var redirectUrl = "http://localhost:3000/momo-callback";
      var ipnUrl = "https://callback.url/notify";
      // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
      var amount = total;
      var requestType = "payWithMethod";
      var extraData = ""; //pass empty value if your merchant does not have stores

      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

      var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      //json object send to MoMo endpoint
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "en",
      });
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.status(200).json({ url: response.data.payUrl });
    }

    // Xóa item đã đặt ra khỏi giỏ hàng
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postOrder", error.message);
    return res
      .status(500)
      .json({ message: "Tạo đơn hàng thất bại", error: error.message });
  }
};
exports.getMomoCallback = async (req, res) => {
  try {
    console.log(req.query);
    const { orderId, resultCode, message } = req.query;
    if (resultCode == 0) {
      const order = orderEntity.findOne({ _id: orderId });
      if (!order) return res.status(404).json("Không tìm thấy đơn hàng");
      await orderEntity.updateOne(
        { _id: orderId },
        { paymentStatus: "Đã thanh toán" }
      );
      return res.redirect(`http://localhost:5173/cart?message=${message}`);
    }
    return res.status(400).json("Lỗi thanh toán");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { status, paymentStatus, refundStatus, note } = req.body;

    if (!status && !paymentStatus && !refundStatus && !note) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp thông tin cần cập nhật" });
    }

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const updateData = {};
    if (status) {
      updateData.status = status;
      // Nếu cập nhật thành "Đã hủy" và refund status chưa "Đã hoàn tiền", tự động set thành "Đang xử lý"
      if (
        status === "Đã hủy" &&
        order.refundStatus !== "Đã hoàn tiền" &&
        !refundStatus
      ) {
        updateData.refundStatus = "Đang xử lý";
        updateData.refundReason = updateData.refundReason || "Hủy đơn hàng";
        updateData.refundDate = new Date();
      }
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (refundStatus) updateData.refundStatus = refundStatus;
    if (note) updateData.note = note;

    const updatedOrder = await orderEntity.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ result: updatedOrder, message: "Cập nhật đơn hàng thành công" });
  } catch (error) {
    console.log("Error in updateOrderStatus:", error.message);
    return res.status(500).json({ message: "Cập nhật đơn hàng thất bại" });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const { reason } = req.body;

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.status === "Đã giao" || order.status === "Đã hủy") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng này" });
    }

    // Restore product stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await productEntity.findByIdAndUpdate(item.productId, {
          $inc: { quantityStock: item.quantity },
        });
      }
    }

    // Xử lý hoàn tiền
    const refundAmount = order.totalAmount;
    const refundDate = new Date();

    const cancelledOrder = await orderEntity.findByIdAndUpdate(
      id,
      {
        status: "Đã hủy",
        refundStatus: "Đang xử lý",
        refundAmount: refundAmount,
        refundReason: reason || "Khách hàng yêu cầu hủy",
        refundDate: refundDate,
      },
      { new: true }
    );

    // Log hoàn tiền
    console.log(
      `Hoàn tiền ${refundAmount} VNĐ cho đơn hàng ${id}. Lý do: ${
        reason || "Khách hàng yêu cầu hủy"
      }`
    );

    return res.status(200).json({
      result: cancelledOrder,
      message:
        "Đơn hàng đã bị hủy. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc",
    });
  } catch (error) {
    console.log("Error in cancelOrder:", error.message);
    return res.status(500).json({ message: "Hủy đơn hàng thất bại" });
  }
};

// Process refund - Admin endpoint to confirm refund
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== "Đã hủy") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể hoàn tiền cho đơn hàng đã hủy" });
    }

    if (order.refundStatus === "Đã hoàn tiền") {
      return res.status(400).json({ message: "Đơn hàng này đã hoàn tiền rồi" });
    }

    const refundedOrder = await orderEntity.findByIdAndUpdate(
      id,
      {
        refundStatus: "Đã hoàn tiền",
        refundDate: new Date(),
      },
      { new: true }
    );

    console.log(
      `Hoàn tiền ${refundedOrder.refundAmount} VNĐ cho đơn hàng ${id} hoàn tất`
    );

    return res.status(200).json({
      result: refundedOrder,
      message: `Hoàn tiền ${refundedOrder.refundAmount} VNĐ thành công`,
    });
  } catch (error) {
    console.log("Error in processRefund:", error.message);
    return res.status(500).json({ message: "Xử lý hoàn tiền thất bại" });
  }
};

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Vui lòng cung cấp userId" });
    }

    const orders = await orderEntity
      .find({ userId })
      .populate("userId")
      .populate("couponId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ result: orders });
  } catch (error) {
    console.log("Error in getUserOrders:", error.message);
    return res
      .status(500)
      .json({ message: "Lấy đơn hàng của người dùng thất bại" });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderEntity.countDocuments();
    const completedOrders = await orderEntity.countDocuments({
      status: "Đã giao",
    });
    const cancelledOrders = await orderEntity.countDocuments({
      status: "Đã hủy",
    });
    const pendingOrders = await orderEntity.countDocuments({
      status: "Chờ xác nhận",
    });

    const totalRevenue = await orderEntity.aggregate([
      { $match: { status: "Đã giao" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    return res.status(200).json({
      result: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.log("Error in getOrderStats:", error.message);
    return res.status(500).json({ message: "Lấy thống kê đơn hàng thất bại" });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderEntity.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Delete order items
    await orderItemsEntity.deleteMany({ orderId: id });

    // Delete order
    await orderEntity.findByIdAndDelete(id);

    return res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.log("Error in deleteOrder:", error.message);
    return res.status(500).json({ message: "Xóa đơn hàng thất bại" });
  }
};
