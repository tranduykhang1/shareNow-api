const router = require('express').Router(); 

const {verifyJwt} = require('../../Config/jwt.js')
const groupController = require('./Group.controller')


router.get("/detail/:id", verifyJwt, groupController.groupDetail)
router.post("/create", verifyJwt, groupController.createGroup)
router.delete("/delete", verifyJwt, groupController.deleteGroup)
router.put("/update", verifyJwt, groupController.updateGroup)
router.put("/background", verifyJwt, groupController.updateGroup)
router.post("/add-member", verifyJwt, groupController.addMember)
router.delete("/remove-member", verifyJwt, groupController.removeMember)
router.get("/check-user/:group_id", verifyJwt, groupController.checkUser)
router.get("/users-group", verifyJwt, groupController.allGroupByUser)
router.get("/members/:group_id", verifyJwt, groupController.membersInGroup)
router.get("/search", verifyJwt, groupController.searchGroup)
router.post("/create-post", verifyJwt, groupController.createPost)
router.get("/news/:group_id", verifyJwt, groupController.newsInGroup)
router.get("/news", verifyJwt, groupController.groupNews)

module.exports = router
