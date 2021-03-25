const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class interactiveModel {
	createCommentModel(postId, data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{ _id: ObjectID(postId) },
				{ $push: { comments: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Comment success!");
				}
			);
		});
	}
	deleteCommentModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.findOneAndUpdate(
				{ _id: ObjectID(data.postId) },
				{ $pull: { comments: { id: data.commentId } } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Comment was deleted!");
				}
			);
		});
	}
	editCommentModel(data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
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
		});
	}
	likePostModel(postId, data, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{
					_id: ObjectID(postId),
				},
				{ $push: { likers: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Like this post!");
				}
			);
		});
	}
	unLikePostModel(data, cb) {
		console.log(data);
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.updateOne(
				{
					_id: ObjectID(data.postId),
				},
				{ $pull: { likers: { id: data.likeId } } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "unLike this post!");
				}
			);
		});
	}
}

module.exports = new interactiveModel();
