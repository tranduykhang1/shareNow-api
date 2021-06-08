const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");
const uuid = require("uuid");

class messageModel {
    constructor() {
        conn.then((db) => {
            const messageDB = db.collection("message");
            this.messageDB = messageDB;
            const messageRoomDB = db.collection("message_room");
            this.messageRoomDB = messageRoomDB;
        });
    }
    createConversationModel(data, cb) {
        this.messageDB.findOne({
            $or: [{ $and: [{ "user.to": data.thisUser }, { "user.from": data.otherUser }] },
                { $and: [{ "user.from": data.thisUser }, { "user.to": data.otherUser }] }
            ]
        }).then(result => {
            if (result === null) {
                this.messageDB.insertOne(
                    data, { forceServerObjectId: true },
                    (err, result) => {
                        if (err) return cb(err);
                        return cb(null, "Conversation created!");
                    }
                );
            }
        })

    }
    deleteConversationModel(data, cb) {
        this.messageDB.deleteMany({
                $or: [{ $and: [{ "user.to": data.thisUser }, { "user.from": data.otherUser }] },
                    { $and: [{ "user.from": data.thisUser }, { "user.to": data.otherUser }] }
                ]
            },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Conversation deleted!");
            }
        );
    }
    newMessageModel(data, id, cb) {
        this.messageDB.updateOne({ _id: ObjectID(id) }, { $push: { message_list: data } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Message saved!");
            }
        );
    }
    deleteMessageModel(data, cb) {
        this.messageDB.updateOne({
                "message_list.message_id": data.msg_id,
            }, { $set: { "message_list.$.is_deleted": true } },
            (err, result) => {
                if (result) return cb(null, "Message was deleted!");
            }
        );
    }
    getMessageModel(data, cb) {
        this.messageDB.findOne({
            $or: [{ $and: [{ "user.to": data.from }, { "user.from": data.to }] },
                { $and: [{ "user.from": data.from }, { "user.to": data.to }] }
            ]
        }, (err, result) => {
            if (err) return cb(err);
            if (result && result.user.from === data.from) {
                this.messageDB.aggregate([
                    { $match: { $and: [{ "user.from": data.from }, { "user.to": data.to }] } },
                    { $addFields: { userId: { $toObjectId: "$user.to" } } },
                    {
                        $lookup: {
                            from: "user",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userInfo"
                        }
                    },
                    {
                        $project: {
                            "userInfo._id": 1,
                            "userInfo.avatar": 1,
                            "userInfo.full_name": 1,
                            "userInfo.state.online": 1,
                            "message_list": 1
                        }
                    }
                ]).toArray().then(res => cb(null, res))
            } else {
                this.messageDB.aggregate([
                    { $match: { $and: [{ "user.to": data.from }, { "user.from": data.to }] } },
                    { $addFields: { userId: { $toObjectId: "$user.from" } } },
                    {
                        $lookup: {
                            from: "user",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userInfo"
                        }
                    },
                    {
                        $project: {
                            "userInfo._id": 1,
                            "userInfo.avatar": 1,
                            "userInfo.full_name": 1,
                            "userInfo.state.online": 1,
                            "message_list": 1
                        }
                    }
                ]).toArray().then(res => cb(null, res))
            }

        });
    }
    getMessageListModel(userId, cb) {
        let messageList
        this.messageDB.aggregate([
            { $match: { $or: [{ "user.from": userId }, { "user.to": userId }] } },
            { $addFields: { userFrom: { $toObjectId: "$user.from" } } },
            { $addFields: { userTo: { $toObjectId: "$user.to" } } },

            {
                $lookup: {
                    from: "user",
                    localField: "userFrom",
                    foreignField: "_id",
                    as: "userFrom"
                }
            }, {
                $lookup: {
                    from: "user",
                    localField: "userTo",
                    foreignField: "_id",
                    as: "userTo"
                }
            }, {
                $project: {
                    "userFrom._id": 1,
                    "userFrom.avatar": 1,
                    "userFrom.full_name": 1,
                    "userFrom.state.online": 1,
                    "userTo._id": 1,
                    "userTo.avatar": 1,
                    "userTo.full_name": 1,
                    "userTo.state.online": 1,
                    userGroup: 1,
                    message: { $arrayElemAt: ["$message_list", -1] }
                }
            },
            {
                $sort: { "message.sent_at": 1 }
            }
        ]).toArray().then(async messages => {

            messages.map(message => {
                if (message.userFrom[0]._id == userId) {
                    delete message["userFrom"]
                }
                if (message.userTo[0]._id == userId) {
                    delete message["userTo"]
                }
            })

            this.messageRoomDB.aggregate([
                { $match: { "members": userId } },
                {
                    $project: {
                        name: 1,
                        _id: 1,
                        members: 1,
                        room_code: 1,
                        message: { $arrayElemAt: ["$message_list", -1] }
                    }
                },
            ]).toArray().then(rooms => {
                messageList = messages

                rooms.map(room => messageList.push(room))
                console.log(messageList)
                messageList.sort((a, b) => {
                    let sent_at_a = 0,
                        sent_at_b = 0
                    if (a.message) {
                        sent_at_a = new Date(a.message.sent_at)
                    }
                    if (b.message) {
                        sent_at_b = new Date(b.message.sent_at)
                    }
                    return (sent_at_b - sent_at_a)
                })
                return cb(null, messageList)
            })
        })
    }
}

module.exports = new messageModel();