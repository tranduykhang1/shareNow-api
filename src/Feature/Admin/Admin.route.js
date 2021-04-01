const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");
const adminController = require("./Admin.controller");

router.put("/account", verifyJwt, adminController.lockAccount);
router.put("/post", verifyJwt, adminController.lockPost);
router.put("/unlock-account", verifyJwt, adminController.unLockAccount);
router.put("/unlock-post", verifyJwt, adminController.unLockPost);
router.get("/post", verifyJwt, adminController.listLockedPost);
router.get("/account", verifyJwt, adminController.listLockedAccount);

module.exports = router;
