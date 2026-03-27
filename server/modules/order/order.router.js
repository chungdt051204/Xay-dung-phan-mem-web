const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

// Order routes - More specific routes FIRST
router.get("/order/id", orderController.getOrderById);
router.get("/order/stats", orderController.getOrderStats);
router.post("/order/cancel", orderController.cancelOrder);
router.put("/order/refund", orderController.processRefund);

// General routes
router.get("/order", orderController.getOrder);
router.post("/order", orderController.postOrder);
router.put("/order", orderController.updateOrderStatus);
router.delete("/order", orderController.deleteOrder);

// User specific routes
router.get("/user/orders", orderController.getUserOrders);

module.exports = router;
