const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const {
  verifyToken,
  verifyAdmin,
} = require("../../service/middleware/authMiddleware");
const prefix = "";

router.get("/order", orderController.getOrder);
router.get("/order/:id", orderController.getOrderById);
router.get("/user/order", verifyToken, orderController.getUserOrder);
router.post("/order", verifyToken, orderController.postOrder);
router.get(`${prefix}/momo-callback`, orderController.getMomoCallback);
router.put("/order/cancel", verifyToken, orderController.cancelOrder);
router.put(
  "/order/:id",
  verifyToken,
  verifyAdmin,
  orderController.updateOrderStatus
);
module.exports = router;
