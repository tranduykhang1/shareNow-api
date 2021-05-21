const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB");

class groupModel {
	
	constructor() {
		conn.then((db) => {
			const groupDB = db.collection("group");
			this.groupDB = groupDB;
		});
	}
	createGroupModel(data, cb) {
			this.groupDB.insertOne(
				data,
				{ forceServerObjectId: true },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New group was created!");
				}
			);
	}
	deleteGroupModel(groupId, cb) {
			this.groupDB.deleteOne({ _id: ObjectID(groupId) }, (err, result) => {
				if (err) return cb(new Error(err));
				return cb(null, "Group was deleted!");
			});
	}
	updateGroupModel(data, cb) {
			this.groupDB.updateOne(
				{ _id: ObjectID(data.id) },
				{ $set: { name: data.name, topic: data.topic } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "Group was updated!");
				}
			);
	}
	addMemberModel(data, cb) {
			this.groupDB.updateOne(
				{ _id: ObjectID(data.id) },
				{ $push: { members: data.user } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "User was added!");
				}
			);
	}
	removeMemberModel(data, cb) {
			this.groupDB.updateOne(
				{ _id: ObjectID(data.id) },
				{ $pull: { members: data.user } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "User was removed!");
				}
			);
	}

	//get post list of group by user
	groupByUserModel(id, cb) {
			this.groupDB
				.find({ members: id })
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(new Error(err)));
	}
	searchGroupModel(q, cb) {
			this.groupDB
				.find({ search_name: { $regex: q } })
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(new Error(err)));
	}
	createNewPostModel(group, data, cb) {
			this.groupDB.updateOne(
				{ _id: ObjectID(group) },
				{ $push: { post: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New post was created!");
				}
			);
	}
}

module.exports = new groupModel();
