const conn = require("../../Connection/ConnectDB");

class theCurriculumModel {
	constructor() {
		conn.then((db) => {
			const departmentDB = db.collection("department");
			const industryDB = db.collection("industry");
			const tagDB = db.collection("tag");
			this.departmentDB = departmentDB;
			this.industryDB = industryDB;
			this.tagDB = tagDB;
		});
	}
	getDepartmentModel(cb) {
		this.departmentDB
			.find({})
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	getIndustryModel(cb) {
		this.industryDB
			.find({})
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	getTagListModel(cb) {
		this.tagDB.find({}).toArray().then((result) => cb(null, result));
	}
}

module.exports = new theCurriculumModel();
