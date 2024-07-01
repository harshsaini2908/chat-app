import express from 'express';
import {getUserForSidebar} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router =express.Router();

// protectRoute middleware will ensure that unauthorized users wont be able to call this function
router.get("/",protectRoute,getUserForSidebar);

export default router;