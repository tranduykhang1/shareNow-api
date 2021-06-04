const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");
const notificationModel = require("../Notification/Notification.model");

class interactiveModel {
	constructor() {
		conn.then((db) => {
			const postDB = db.collection("post");
			this.postDB = postDB;
		});
	}
	createCommentModel(postId, data, cb) {
		this.postDB.findOneAndUpdate(
			{ _id: ObjectID(postId) },
			{ $push: { comments: data } },
			(err, result) => {
				if (err) return cb(err);
				//update notifications
				let userRepsonse = result.value;
				notificationModel.pushNotice(
					data.comment_by.id,
					userRepsonse.user.id,
					postId,
					"đã bình luận bài viết",
					"comment",
					(err, result) => {
						if (err) return cb(err);
						//socket handler
						return cb(null, "Posted");
					}
				);
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
		this.postDB.findOneAndUpdate(
			{
				_id: ObjectID(postId),
			},
			{ $push: { likers: data } },
			(err, result) => {
				if (err) return cb(err);
				//update notifications
				let userRepsonse = result.value;
				notificationModel.pushNotice(
					data.user,
					userRepsonse.user.id,
					postId,
					"đã quan tâm bài viết",
					"like",
					(err, result) => {
						if (err) return cb(err);
						//socket handler
						return cb(null, "Care this post");
					}
				);
				//
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
