const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB");

class groupModel {
	createGroupModel(data, cb) {
		conn.then((db) => {
			const groupDb = db.collection("group");
			groupDb.insertOne(
				data,
				{ forceServerObjectId: true },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New group was created!");
				}
			);
		});
	}
	deleteGroupModel(groupId, cb) {
		conn.then((db) => {
			const groupDb = db.collection("group");
			groupDb.deleteOne({ _id: ObjectID(groupId) }, (err, result) => {
				if (err) return cb(new Error(err));
				return cb(null, "Group was deleted!");
			});
		});
	}
	updateGroupModel(data, cb) {
		conn.then((db) => {
			const groupDb = db.collection("group");
			groupDb.updateOne(
				{ _id: ObjectID(data.id) },
				{ $set: { name: data.name, topic: data.topic } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "Group was updated!");
				}
			);
		});
	}
	addMemberModel(data, cb) {
		conn.then((db) => {
			const groupDb = db.collection("group");
			groupDb.updateOne(
				{ _id: ObjectID(data.id) },
				{ $push: { members: data.user } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "User was added!");
				}
			);
		});
	}
	removeMemberModel(data, cb) {
		conn.then((db) => {
			const groupDB = db.collection("group");
			groupDB.updateOne(
				{ _id: ObjectID(data.id) },
				{ $pull: { members: data.user } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "User was removed!");
				}
			);
		});
	}
	groupByUserModel(id, cb) {
		conn.then((db) => {
			const groupDB = db.collection("group");
			groupDB
				.find({ members: id })
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(new Error(err)));
		});
	}
	searchGroupModel(q, cb) {
		conn.then((db) => {
			const groupDB = db.collection("group");
			groupDB
				.find({ search_name: { $regex: q } })
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(new Error(err)));
		});
	}
	createNewPostModel(group, data, cb) {
		conn.then((db) => {
			const groupDB = db.collection("group");
			groupDB.updateOne(
				{ _id: ObjectID(group) },
				{ $push: { post: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New post was created!");
				}
			);
		});
	}
}

module.exports = new groupModel();
