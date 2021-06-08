const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");
const messageModel = require("../Message/Message.model");
const notificationModel = require("../Notification/Notification.model");

const conn = require("../../Connection/ConnectDB.js");

class userModel {
    constructor() {
        conn.then((db) => {
            const userDB = db.collection("user");
            this.userDB = userDB;
        });
    }
    confirmUserModel(userId, data, cb) {
        let {
            department,
            industry,
            course,
            class_room,
            student_code,
            student_type,
        } = data;
        this.userDB.updateOne({ _id: ObjectID(userId) }, {
                $set: {
                    student_code: student_code,
                    student_type: student_type,
                    department: department,
                    industry: industry,
                    class_room: class_room,
                    course: course,
                    "state.active": true,
                },
            },
            (err, result) => {
                if (err) return cb(new Error(err));
                return cb(null, "User is active");
            }
        );
    }
    getProfileModel(userId, cb) {
        this.userDB
            .aggregate([
                { $match: { _id: ObjectID(userId) } },
                { $addFields: { departmentId: { $toObjectId: "$department" } } },
                { $addFields: { industryId: { $toObjectId: "$industry" } } },
                {
                    $lookup: {
                        from: "department",
                        localField: "departmentId",
                        foreignField: "_id",
                        as: "department",
                    },
                },
                {
                    $lookup: {
                        from: "industry",
                        localField: "industryId",
                        foreignField: "_id",
                        as: "industry",
                    },
                },
            ])
            .toArray()
            .then((result) => cb(null, result[0]))
            .catch((err) => {
                this.userDB
                    .findOne({ _id: ObjectID(userId) })
                    .then((result) => cb(null, result));
            });
    }
    updateProfileModel(userSchema, email, cb) {
        this.userDB.updateOne({ email: email }, {
                $set: {
                    full_name: userSchema.full_name,
                    username: userSchema.username,
                    from: userSchema.from,
                    birthday: userSchema.birthday,
                    gender: userSchema.gender,
                    student_type: userSchema.student_type,
                    student_code: userSchema.student_code,
                    department: userSchema.department,
                    industry: userSchema.industry,
                    course: userSchema.course,
                    class_room: userSchema.class_room.toUpperCase(),
                    bio: userSchema.bio,
                },
            },
            (err, result) => {
                if (err) return cb(new Error(err));
                else return cb(null, result);
            }
        );
    }
    updateAvatarModel(data, cb) {
        this.userDB.updateOne({ email: data.email }, { $set: { avatar: data.url } },
            (err, result) => {
                if (err) return cb(new Error(err));
                else return cb(null, result);
            }
        );
    }
    updateBackgroundModel(data, cb) {
        this.userDB.updateOne({ email: data.email }, { $set: { background: data.url } },
            (err, result) => {
                if (err) return cb(new Error(err));
                return cb(null, result);
            }
        );
    }
    followUserModel(data, cb) {
        this.userDB.findOne({ _id: ObjectID(data.thisUser), following: data.otherUser },
            (err, result) => {
                if (err) return new Error(err);
                else {
                    if (result) {
                        this.userDB.updateOne({ _id: ObjectID(data.thisUser) }, { $pull: { following: data.otherUser } },
                            (err, result) => {
                                if (result) {
                                    this.userDB.updateOne({ _id: ObjectID(data.otherUser) }, { $pull: { followers: data.thisUser } },
                                        (err, result) => {
                                            if (result) {
                                                messageModel.deleteConversationModel({
                                                        thisUser: data.thisUser,
                                                        otherUser: data.otherUser,
                                                    },
                                                    (err, result) => {
                                                        if (err) {
                                                            return cb(err);
                                                        }
                                                        return cb(
                                                            null,
                                                            "unFollowing this user!"
                                                        );
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    } else {
                        this.userDB.updateOne({ _id: ObjectID(data.thisUser) }, { $push: { following: data.otherUser } },
                            (err, result) => {
                                if (result) {
                                    this.userDB.updateOne({ _id: ObjectID(data.otherUser) }, { $push: { followers: data.thisUser } },
                                        (err, result) => {
                                            if (result) {
                                                messageModel.createConversationModel({
                                                        user: { from: data.thisUser, to: data.otherUser },
                                                        message_list: [],
                                                    },
                                                    (err, result) => {
                                                        if (result) {
                                                            notificationModel.pushNotice(
                                                                data.thisUser,
                                                                data.otherUser,
                                                                data.thisUser,
                                                                "đã theo dõi bạn",
                                                                "follow",
                                                                (err, result) => {
                                                                    if (err) return cb(err);
                                                                    //socket handler
                                                                    return cb(
                                                                        null,
                                                                        "Following this user!"
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                    //update notifications
                }
            }
        );
    }
    listFollowingModel(userId, cb) {
        this.userDB
            .aggregate([
                { $match: { _id: ObjectID(userId) } },
                { $unwind: "$following" },
                { $addFields: { userId: { $toObjectId: "$following" } } },
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
                        "users._id": 1,
                        "users.avatar": 1,
                        "users.full_name": 1,
                        "users.class_room": 1
                    },
                },
            ])
            .toArray()
            .then((result) => cb(null, result))
            .catch((err) => cb(err));
    }
    listFollowerModel(userId, cb) {
        this.userDB
            .aggregate([
                { $match: { _id: ObjectID(userId) } },
                { $unwind: "$following" },
                { $addFields: { userId: { $toObjectId: "$followers" } } },
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
                        "users._id": 1,
                        "users.avatar": 1,
                        "users.full_name": 1,
                    },
                },
            ])
            .toArray()
            .then((result) => cb(null, result))
            .catch((err) => cb(err));
    }
    onlineStateModel(userId) {
        this.userDB.updateOne({
            _id: ObjectID(userId),
        }, { $set: { "state.online": true } });
    }
    offlineStateModel(userId) {
        this.userDB.updateOne({
            _id: ObjectID(userId),
        }, { $set: { "state.online": false } });
    }

    getTotalUserModel(cb) {
        let response = {
            total: 0,
            online: 0,
        };
        this.userDB
            .aggregate([
                { $match: { "state.online": true } },
                {
                    $count: "online",
                },
            ])
            .toArray()
            .then((result) => {
                if (result[0]) {
                    response.online = result[0].online;
                }
                this.userDB
                    .aggregate([{
                        $count: "total",
                    }, ])
                    .toArray()
                    .then((result) => {
                        response.total = result[0].total;
                        return cb(null, response);
                    });
            });
    }

    getUserRelatedModel(user, cb) {
        this.userDB.find({
            $or: [{ industry: user.industry }, { department: user.department }]
        }).toArray().then(result => cb(null, result))
    }

}

module.exports = new userModel();