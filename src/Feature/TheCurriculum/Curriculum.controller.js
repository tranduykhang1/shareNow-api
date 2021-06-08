const CurriculumModel = require("./Curriculum.model");

class theCurriculum {
    getDepartment(req, res) {
        CurriculumModel.getDepartmentModel((err, result) => {
            if (err) res.status(500).json(err);
            else {
                // result.splice(result.length - 1, 1);
                res.status(200).json(result);
            }
        });
    }
    getIndustry(req, res) {
        CurriculumModel.getIndustryModel((err, result) => {
            if (err) res.status(500).json(err);
            res.status(200).json(result);
        });
    }
    getTagList(req, res) {
        CurriculumModel.getTagListModel((err, result) => {
            if (err) res.status(500).json(err);
            res.status(200).json(result);
        });
    }
}

module.exports = new theCurriculum();