const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB.js");

class adminModel {
	lockAccountModel(userId, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.updateOne(
				{
					_id: ObjectID(userId),
				},
				{ $set: { "state.locked": true } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: User is locked!");
				}
			);
		});
	}
	lockPostModel(post_id, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{
					_id: ObjectID(post_id),
				},
				{ $set: { "state.locked": true } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: Post is locked!");
				}
			);
		});
	}
	unLockAccountModel(userId, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.updateOne(
				{
					_id: ObjectID(userId),
				},
				{ $set: { "state.locked": false } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: User is unlocked!");
				}
			);
		});
	}
	unLockPostModel(postId, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{
					_id: ObjectID(postId),
				},
				{ $set: { "state.locked": false } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Msg success: Post is unlocked!");
				}
			);
		});
	}
	listPostLockedModel(cb) {
		conn.then((db) => {
			const postBD = db.collection("post");
			postBD
				.aggregate([{ $match: { "state.locked": true } }])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
		});
	}
	listAccountLockedModel(cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB
				.aggregate([{ $match: { "state.locked": true } }])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
		});
	}
}

module.exports = new adminModel();
