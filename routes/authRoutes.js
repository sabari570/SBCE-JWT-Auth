const { Router } = require('express');
const authController = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddlewares");

const router = Router();

// API for Test route
router.get("/test", authController.test_router);

// API for Signing up an user
router.post("/signup", authController.signup_post);

//API for loggin in an user
router.post("/login", authController.login_post);

router.get("/home", requireAuth, authController.home_route);

module.exports = router;