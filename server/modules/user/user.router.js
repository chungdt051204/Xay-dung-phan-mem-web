const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
router.get(`${prefix}/auth/google`, userController.getLoginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.post(`${prefix}/register`, userController.postRegister);
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/me`, userController.getMe);
router.post(`${prefix}/reset`, userController.postReset);
router.post(`${prefix}/confirm`, userController.postConfirm);
module.exports = router;
