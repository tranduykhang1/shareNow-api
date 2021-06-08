const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");
const serachController = require("./Search.controller");

router.get("/user/", verifyJwt, serachController.searchUser)
router.get("/group/", verifyJwt, serachController.searchGroup)
router.get("/all/:query", verifyJwt, serachController.searchAll)





module.exports = router;