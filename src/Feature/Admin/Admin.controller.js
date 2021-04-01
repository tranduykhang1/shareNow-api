const adminModel = require("./Admin.model");

class Admin {
	lockAccount(req, res) {
		const { user_id } = req.body;
		adminModel.lockAccountModel(user_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	lockPost(req, res) {
		const { post_id } = req.body;
		adminModel.lockPostModel(post_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	unLockAccount(req, res) {
		const { user_id } = req.body;
		adminModel.unLockAccountModel(user_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	unLockPost(req, res) {
		const { post_id } = req.body;
		adminModel.unLockPostModel(post_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	listLockedPost(req, res) {
		adminModel.listLockedPostModel((err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	listLockedAccount(req, res) {
		adminModel.listAccountLockedModel((err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
}

module.exports = new Admin();
