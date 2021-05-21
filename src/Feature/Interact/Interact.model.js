const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class interactiveModel {
	constructor() {
		conn.then((db) => {
			const postDB = db.collection("post");
			this.postDB = postDB;
		});
	}
	createCommentModel(postId, data, cb) {
			this.postDB.updateOne(
				{ _id: ObjectID(postId) },
				{ $push: { comments: data } },
				(err, result) => {
					if (err) return cb(err);
					//update notifications
					return cb(null, "Comment success!");
				}
			);
	}
	deleteCommentModel(data, cb) {
			this.postDB.findOneAndUpdate(
				{ _id: ObjectID(data.postId) },
				{ $pull: { comments: { id: data.commentId } } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Comment was deleted!");
				}
			);
	}
	editCommentModel(data, cb) {
			this.postDB.updateOne(
				{
					"comments.id": data.commentId,
				},
				{ $set: { "comments.$.content": data.content } },
				(err, result) => {
					if (err) {
						console.log(err);
						return cb(err);
					}
					return cb(null, "Comment was edited!");
				}
			);
	}
	likePostModel(postId, data, cb) {
			this.postDB.updateOne(
				{
					_id: ObjectID(postId),
				},
				{ $push: { likers: data } },
				(err, result) => {
					if (err) return cb(err);
					//update notifications
					return cb(null, "Like this post!");
				}
			);
	}
	unLikePostModel(data, cb) {
		console.log(data);
			this.postDB.updateOne(
				{
					_id: ObjectID(data.postId),
				},
				{ $pull: { likers: { id: data.likeId } } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "unLike this post!");
				}
			);
	}
	getCommentsModel(limit, postId, cb) {
		this.postDB
			.aggregate([
				{ $match: { _id: ObjectID(postId) } },
				{ $project: { comments: { $slice: ["$comments", limit] } } },
			])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
}

module.exports = new interactiveModel();
