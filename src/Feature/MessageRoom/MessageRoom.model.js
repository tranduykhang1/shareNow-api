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
        this.roomDB.insertOne(data, { forceServerObjectId: true }, (err, result) => {
            if (err) return cb(err);
            return cb(null, "Room was created!");
        });
    }
    newMessageRoomModel(room, data, cb) {
        this.roomDB.updateOne({ _id: ObjectID(room) }, { $push: { message_list: data } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "New message was inserted!");
            }
        );
    }
    deleteMsgRoomModel(room, cb) {
        this.roomDB.updateOne({
                "messages.message_id": room,
            }, { $set: { "messages.$.is_deleted": true } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Message was deleted!");
            }
        );
    }
    getRoomMessageModel(room, cb) {
        this.roomDB
            .aggregate([
                { $match: { _id: ObjectID(room) } },
            ])
            .toArray()
            .then((result) => cb(null, result));
    }
    getRoomMembersModel(room, cb) {
        this.roomDB
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
                        "users.avatar": 1,
                        "users.full_name": 1,
                        "users._id": 1
                    },
                },
            ])
            .toArray()
            .then((result) => cb(null, result));
    }
    joinRoomModel(data, cb) {
        this.roomDB.findOne({ room_code: data.room }, (err, room) => {
            if (err) return cb(err);
            else {
                if (room) {
                    this.roomDB.findOne({ room_code: data.room, members: data.user },
                        (err, result) => {
                            if (err) return cb(err);
                            else {
                                if (result) {
                                    return cb(null, "Was in this room");
                                } else {
                                    this.roomDB.updateOne({ room_code: data.room }, { $push: { members: data.user } },
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
        this.roomDB.updateOne({ _id: ObjectID(data.room) }, { $pull: { members: data.user } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Left!");
            }
        );
    }
    destroyRoomModel(room, cb) {
        this.roomDB.deleteOne({ _id: ObjectID(room) }, (err, result) => {
            if (err) return cb(err)
            return cb(null, "Room was deleted!")
        })
    }
}

module.exports = new messageRoomModel();