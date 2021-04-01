const { v4: uuid } = require("uuid");
const reportSchema = require("../../Schema/Report");
const reportModel = require("./Report.model");

class Report {
	report(req, res) {
		const { _id } = req.body;
		const { type } = req.body;
		const data = {
			report_id: uuid(),
			user: req.user._id,
			reason: req.body.reason,
		};
		reportSchema.body.type = type;
		reportSchema.body.id = _id;
		reportSchema.report_by.push(data);
		reportModel.reportModel(_id, reportSchema, data, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	reportedAccounts(req, res) {
		reportModel.reportedAccountsModel((err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	reportedPosts(req, res) {
		reportModel.reportedPostsModel((err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
}

module.exports = new Report();
