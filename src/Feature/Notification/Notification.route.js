const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");
const notification = require("./Notification.controller");

router.get("/", verifyJwt, notification.getNotification);
router.get("/read/:notification_id", verifyJwt, notification.readNotification);
router.get("/readed-list", verifyJwt, notification.readedList);

module.exports = router;
