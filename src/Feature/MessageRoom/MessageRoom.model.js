const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class messageRoomModel {
	createRoomModel(data, cb) {
		conn.then((db) => {
			const roomDB = db.collection("message_room");
			roomDB.insertOne(data, (err, result) => {
				if (err) return cb(err);
				return cb(null, "Room was created!");
			});
		});
	}
	newMessageRoomModel(room, data, cb) {
		conn.then((db) => {
			const roomDB = db.collection("message_room");
			roomDB.updateOne(
				{ _id: ObjectID(room) },
				{ $push: { messages: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New message was inserted!");
				}
			);
		});
	}
	deleteMsgRoomModel(room, cb) {
		conn.then((db) => {
			const roomDB = db.collection("message_room");
			roomDB.updateOne(
				{
					"messages.id": room,
				},
				{ $set: { "messages.$.isDeleted": true } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Message was deleted!");
				}
			);
		});
	}
	getRoomMembersModel(room, cb) {
		conn.then((db) => {
			const roomDB = db.collection("message_room");
			roomDB
				.aggregate([
					{ $match: { _id: ObjectID(room) } },
					{ $unwind: "$members" },
					{ $addFields: { userId: { $toObjectId: "$members" } } },
					{
						$lookup: {
							from: "user",
							localField: "userId",
							foreignField: "_id",
							as: "users",
						},
					},
					{
						$project: {
							userId: 1,
							avatar: "$users.avatar",
							fullname: "$users.fullname",
						},
					},
				])
				.toArray()
				.then((result) => cb(null, result));
		});
	}
}

module.exports = new messageRoomModel();
