const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class postModel {
	constructor() {
		conn.then((db) => {
			const postDB = db.collection("post");
			this.postDB = postDB;
		});
	}
	createPostModel(data, cb) {
		this.postDB.insertOne(
			data,
			{ forceServerObjectId: true },
			(err, result) => {
				if (err) {
					return cb(err);
				}
				return cb(null, "Upload success!");
			}
		);
	}
	updatePostModel(data, cb) {
		this.postDB.updateOne(
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
	}
	deletePostModel(postId, cb) {
		this.postDB.deleteOne({ _id: ObjectID(postId) }, (err, result) => {
			if (err) return cb(err);
			return cb(null, "Post was deleted!");
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
	allOfPostsModel(limit, cb) {
		this.postDB
			.aggregate([{ $limit: limit }])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	postOfUser(userId, cb) {
		this.postDB
			.aggregate([{ $match: { "user.id": userId } }])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	getPostByTopicModel(topic, cb) {
		this.postDB
			.aggregate([{ $match: { topic: topic } }])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	getPostByTagModel(topic, tag, cb) {
		this.postDB
			.aggregate([{ $match: { $and: [{ topics: topic }, { tags: tag }] } }])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
}

module.exports = new postModel();
