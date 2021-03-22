const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class postModel {
	createPostModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.insertOne(data, (err, result) => {
				if (err) {
					return cb("Upload fail!");
				}
				return cb(null, "Upload success!");
			});
		});
	}
	updatePostModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{ "list.id": data.id },
				{
					$set: {
						"list.$.body": data.body,
						"list.$.tag": data.tag,
					},
				},
				(err, result) => {
					if (err) {
						return cb("Update fail!");
					}
					return cb(null, "Update success!");
				}
			);
		});
	}
	deletePostModel(postId, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{ "list.id": postId },
				{ $pull: { list: { id: postId } } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Post was deleted!");
				}
			);
		});
	}
	userIsExist(userId, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.findOne({ user: userId }, (err, result) => {
				if (err) return cb("Have a error!!");
				return cb(null, result);
			});
		});
	}
	insertNewPost(userId, data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{ user: userId },
				{ $push: { list: data } },
				(err, result) => {
					if (err) return cb("Update user error!");
					return cb(null, "Inserted new post!");
				}
			);
		});
	}
	postOfUser(userId, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.findOne({ user: userId }, (err, result) => {
				if (err) return cb(err);
				return cb(null, result);
			});
		});
	}
}

module.exports = new postModel();
