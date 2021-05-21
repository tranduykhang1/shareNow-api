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
			messageDB.insertOne(
				data,
				{ forceServerObjectId: true },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Message was created!");
				}
			);
	}
	newMessageModel(data, id, cb) {
			messageDB.updateOne(
				{ _id: ObjectID(id) },
				{ $push: { body: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Message saved!");
				}
			);
	}
	deleteMessageModel(data, cb) {
			messageDB.updateOne(
				{
					"body.message_id": data.msg_id,
				},
				{ $set: { "body.$.isDeleted": true } },
				(err, result) => {
					if (result) return cb(null, "Message was deleted!");
				}
			);
	}
	getMessageModel(data, cb) {
			messageDB.findOne({ $and: [{users: data.from}, {users: data.to}] }, (err, result) => {
				if (err) return cb(err);
				return cb(null, result);
			});
	}
}

module.exports = new messageModel();
