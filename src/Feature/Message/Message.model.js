const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");
const uuid = require("uuid");

class messageModel {
	constructor() {
		conn.then((db) => {
			const messageDB = db.collection("message");
			this.messageDB = messageDB;
		});
	}
	createConversationModel(data, cb) {
			this.messageDB.insertOne(
				data,
				{ forceServerObjectId: true },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Conversation created!");
				}
			);
	}
	deleteConversationModel(data, cb) {
			this.messageDB.deleteMany(
				{$and: [{user: data.thisUser}, {user: data.otherUser}]},
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Conversation deleted!");
				}
			);
	}
	newMessageModel(data, id, cb) {
			this.messageDB.updateOne(
				{ _id: ObjectID(id) },
				{ $push: { message_list: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Message saved!");
				}
			);
	}
	deleteMessageModel(data, cb) {
			this.messageDB.updateOne(
				{
					"message_list.message_id": data.msg_id,
				},
				{ $set: { "message_list.$.is_deleted": true } },
				(err, result) => {
					if (result) return cb(null, "Message was deleted!");
				}
			);
	}
	getMessageModel(data, cb) {
			this.messageDB.findOne({ $and: [{users: data.from}, {users: data.to}] }, (err, result) => {
				if (err) return cb(err);
				return cb(null, result);
			});
	}
}

module.exports = new messageModel();
