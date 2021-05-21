const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB.js");

class adminModel {
	constructor() {
		conn.then((db) => {
			const userDB = db.collection("user");
			const postDB = db.collection("post");
			this.postDB = postDB;
			this.userDB = userDB
		});
	}
	lockAccountModel(userId, cb) {
			this.userDB.updateOne(
				{
					_id: ObjectID(userId),
				},
				{ $set: { "state.locked": true } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: User is locked!");
				}
			);
	}
	lockPostModel(post_id, cb) {
			const postDB = db.collection("post");
			this.postDB.updateOne(
				{
					_id: ObjectID(post_id),
				},
				{ $set: { "state.locked": true } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: Post is locked!");
				}
			);
	}
	unLockAccountModel(userId, cb) {
			this.userDB.updateOne(
				{
					_id: ObjectID(userId),
				},
				{ $set: { "state.locked": false } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: User is unlocked!");
				}
			);
	}
	unLockPostModel(postId, cb) {
			this.postDB.updateOne(
				{
					_id: ObjectID(postId),
				},
				{ $set: { "state.locked": false } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: Post is unlocked!");
				}
			);
	}
	listPostLockedModel(cb) {
			this.postDB
				.aggregate([{ $match: { "state.locked": true } }])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
	}
	listAccountLockedModel(cb) {
			userDB
				.aggregate([{ $match: { "state.locked": true } }])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
	}
}

module.exports = new adminModel();
