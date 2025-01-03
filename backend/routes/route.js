import express from "express";
import { getUserInfo, updateUserInfo } from "../controller/user-controller.js";
import { addStock, buyItems, getStock } from "../controller/market-controller.js";

const router = express.Router();

// Route for Signup & Login

router.post("/get",getUserInfo);
router.post("/update",updateUserInfo);

router.post("/market/add",addStock)
router.post("/market/stock",getStock)
router.post("/market/buy",buyItems);

export default router;