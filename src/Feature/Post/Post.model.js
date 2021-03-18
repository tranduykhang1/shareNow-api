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
				{ _id: ObjectID(data.id) },
				{
					$set: {
						body: data.body,
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
	deletePostModel(id, cb) {
		conn.then((db) => {
			const postDB = db.collection("post");
			postDB.deleteOne({ _id: ObjectID(id) }, (err, result) => {
				if (err) return cb("Delete fail!");
				return cb(null, "Post was deleted!");
			});
		});
	}
}

module.exports = new postModel();
