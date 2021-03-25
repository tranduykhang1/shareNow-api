const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class postModel {
	createPostModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.insertOne(
				data,
				{ forceServerObjectId: true },
				(err, result) => {
					if (err) {
						return cb(err);
					}
					return cb(null, "Upload success!");
				}
			);
		});
	}
	updatePostModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{ _id: ObjectID(data.id) },
				{
					$set: {
						caption: data.caption,
						tag: data.tag,
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
			postDB.deleteOne({ _id: ObjectID(postId) }, (err, result) => {
				if (err) return cb(err);
				return cb(null, "Post was deleted!");
			});
		});
	}
	/*userIsExist(userId, cb) {
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
	*/
	postOfUser(userId, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB
				.aggregate([{ $match: { "user.id": userId } }])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
		});
	}
}

module.exports = new postModel();
