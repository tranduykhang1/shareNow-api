const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");



class messageRoomModel {
	constructor() {
		conn.then((db) => {
			const roomDB = db.collection("message_room");
			this.roomDB = roomDB;
		});
	}
	createRoomModel(data, cb) {
			roomDB.insertOne(data, (err, result) => {
				if (err) return cb(err);
				return cb(null, "Room was created!");
			});
	}
	newMessageRoomModel(room, data, cb) {
			roomDB.updateOne(
				{ _id: ObjectID(room) },
				{ $push: { messages: data } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "New message was inserted!");
				}
			);
	}
	deleteMsgRoomModel(room, cb) {
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
	}
	getRoomMembersModel(room, cb) {
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
	}
	joinRoomModel(data, cb) {
			roomDB.findOne({ room_code: data.room }, (err, room) => {
				if (err) return cb(err);
				else {
					if (room) {
						roomDB.findOne(
							{ room_code: data.room, members: data.user },
							(err, result) => {
								if (err) return cb(err);
								else {
									if (result) {
										return cb(null, "Was in this room");
									} else {
										roomDB.updateOne(
											{ room_code: data.room },
											{ $push: { members: data.user } },
											(err, result) => {
												return cb(null, "Joined!");
											}
										);
									}
								}
							}
						);
					} else {
						return cb(null, "Room not found!");
					}
				}
			});
	}
	leaveRoomModel(data, cb) {
			roomDB.updateOne(
				{ _id: ObjectID(data.room) },
				{ $pull: { members: data.user } },
				(err, result) => {
					if (err) return cb(err);
					return cb(null, "Left!");
				}
			);
	}
	destroyRoomModel(room, cb) {
			roomDB.deleteOne({_id: ObjectID(room)}, (err,result) =>{
				if(err) return cb(err)
				return cb(null, "Room was deleted!")
			})
	}
}

module.exports = new messageRoomModel();
