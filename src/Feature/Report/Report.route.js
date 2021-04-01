const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");
const reportController = require("./Report.controller");

router.post("/account", verifyJwt, reportController.report)
router.get("/account", verifyJwt, reportController.reportedAccounts)
router.get("/post", verifyJwt, reportController.reportedPosts)



module.exports = router;
