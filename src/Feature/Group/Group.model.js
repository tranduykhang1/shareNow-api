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
            data, { forceServerObjectId: true },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "New group was created!");
            }
        );
    }
    groupDetailModel(id, cb) {
        this.groupDB
            .aggregate([
                { $match: { _id: ObjectID(id) } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        admin_key: 1,
                        background: 1,
                        members: 1,
                        topic: 1,
                        password: 1,
                    },
                },
            ])
            .toArray()
            .then((result) => cb(null, result[0]));
    }
    deleteGroupModel(groupId, cb) {
        this.groupDB.deleteOne({ _id: ObjectID(groupId) }, (err, result) => {
            if (err) return cb(new Error(err));
            return cb(null, "Group was deleted!");
        });
    }
    updateBackgroundGroupModel(data, cb) {
        this.groupDB.updateOne({ _id: ObjectID(data.group_id) }, { $set: { background: data.url } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Updated");
            }
        );
    }
    updateGroupModel(data, cb) {
        this.groupDB.updateOne({ _id: ObjectID(data.id) }, {
                $set: {
                    name: data.name,
                    name: data.search_name,
                    topic: data.topic,
                    background: data.background,
                },
            },
            (err, result) => {
                if (err) return cb(new Error(err));
                return cb(null, "Group was updated!");
            }
        );
    }
    addMemberModel(data, cb) {
        this.groupDB.findOne({ $and: [{ _id: ObjectID(data.id) }, { password: data.password }] },
            (err, result) => {
                if (err) return cb(err);
                if (result) {
                    this.groupDB.findOne({ members: data.user }).then((result) => {
                        if (result && result.length) {
                            return cb(null, "User was in group");
                        } else {
                            this.groupDB.updateOne({ _id: ObjectID(data.id) }, { $push: { members: data.user } },
                                (err, result) => {
                                    if (err) return cb(new Error(err));
                                    return cb(null, "User was added!");
                                }
                            );
                        }
                    });
                }
                if (!result) {
                    return cb(null, "Password not match");
                }
            }
        );
        /*

        	*/
    }
    removeMemberModel(data, cb) {
        this.groupDB.updateOne({ _id: ObjectID(data.id) }, { $pull: { members: data.user } },
            (err, result) => {
                if (err) return cb(new Error(err));
                return cb(null, "User was removed!");
            }
        );
    }
    checkUserModel(groupId, userId, cb) {
        this.groupDB.findOne({ $and: [{ _id: ObjectID(groupId) }, { members: userId }] },
            (err, result) => {
                if (err) return cb(err);
                if (result) {
                    return cb(null, true);
                }
                if (!result) {
                    return cb(null, false);
                }
            }
        );
    }
    membersInGroupModel(group_id, cb) {
            this.groupDB
                .aggregate([
                    { $match: { _id: ObjectID(group_id) } },
                    { $unwind: "$members" },
                    { $addFields: { member_id: { $toObjectId: "$members" } } },
                    {
                        $lookup: {
                            from: "user",
                            localField: "member_id",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $project: {
                            "user._id": 1,
                            "user.avatar": 1,
                            "user.full_name": 1,
                            "user.avatar": 1,
                            "user.from": 1,
                        },
                    },
                ])
                .toArray()
                .then((result) => cb(null, result));
        }
        //get post list of group by user
    groupByUserModel(id, cb) {
        this.groupDB
            .aggregate([
                { $match: { members: id } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        background: 1,
                    },
                },
            ])
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
        this.groupDB.updateOne({ _id: ObjectID(group) }, { $push: { post: data } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "New post was created!");
            }
        );
    }
    newsInGroupModel(groupId, cb) {
        let resp = [];
        this.groupDB
            .aggregate([
                { $match: { _id: ObjectID(groupId) } },
                { $unwind: "$post" },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        post: 1,
                    },
                },
            ])
            .toArray()
            .then((news) => {
                news.map((post) => resp.push(post.post));
                resp.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
                return cb(null, resp);
            })
            .catch((err) => cb(err));
    }
    groupNewsModel(user_id, cb) {
        this.groupDB
            .aggregate([
                { $match: { members: user_id } },
                { $unwind: "$post" },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        post: 1,
                    },
                },
                { $sort: { _id: -1 } },
            ])
            .toArray()
            .then((news) => {
                news.sort((a, b) => new Date(b.post.create_at) - new Date(a.post.create_at));
                cb(null, news);
            })
            .catch((err) => cb(err));
    }
}

module.exports = new groupModel();