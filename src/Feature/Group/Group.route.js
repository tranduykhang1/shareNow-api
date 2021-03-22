const router = require('express').Router(); 

const {verifyJwt} = require('../../Config/jwt.js')
const groupController = require('./Group.controller')


router.post("/create", verifyJwt, groupController.createGroup)
router.delete("/delete", verifyJwt, groupController.deleteGroup)
router.put("/update", verifyJwt, groupController.updateGroup)
router.post("/add-member", verifyJwt, groupController.addMember)
router.delete("/remove-member", verifyJwt, groupController.removeMember)
router.get("/users-group", verifyJwt, groupController.allGroupByUser)
router.get("/search", verifyJwt, groupController.searchGroup)
router.post("/create-post", verifyJwt, groupController.createPost)


module.exports = router
