const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");
const theCurriculum = require("./Curriculum.controller");


router.get("/departments", verifyJwt, theCurriculum.getDepartment)
router.get("/industries", verifyJwt, theCurriculum.getIndustry)
router.get("/tag-list", verifyJwt, theCurriculum.getTagList)

module.exports = router;
