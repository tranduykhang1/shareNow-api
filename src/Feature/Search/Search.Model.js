const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class reportModel {
    constructor() {
        conn.then((db) => {
            const groupDB = db.collection("group");
            const userDB = db.collection("user");
            this.groupDB = groupDB;
            this.userDB = userDB;
        });
    }

    searchAllModel(data, cb) {
        let resp = [];
        if (!data.filter) {
            this.userDB
                .find({
                    search_name: { $regex: data.params },
                })
                .toArray()
                .then((result) => {
                    resp.push(result);
                    this.groupDB
                        .find({
                            search_name: { $regex: data.params },
                        })
                        .toArray()
                        .then((result) => {
                            result.map((res) => resp.push(res));
                            cb(null, resp);
                        });
                });
        } else {
            this.userDB
                .find({
                    $or: [
                        { search_name: { $regex: data.params } },
                        { department: data.filter },
                    ],
                })
                .toArray()
                .then((result) => {
                    resp.push(result);
                    this.group
                        .find({
                            $or: [
                                { search_name: { $regex: data.params } },
                                { topic: data.filter },
                            ],
                        })
                        .toArray()
                        .then((result) => {
                            result.map((res) => resp.push(res));
                            cb(null, resp);
                        })
                        .catch((err) => {
                            return cb(err);
                        });
                })
                .catch((err) => {
                    return cb(err);
                });
        }
    }
    searchUserModel(data, cb) {
        if (!data.filter) {
            this.userDB
                .find({
                    search_name: { $regex: data.params },
                })
                .toArray()
                .then((result) => {
                    cb(null, result);
                })
                .catch((err) => {
                    console.log(err);
                    return cb(err);
                });
        } else {
            this.userDB
                .find({
                    $and: [
                        { search_name: { $regex: data.params } },
                        { department: data.filter },
                    ],
                })
                .toArray()
                .then((result) => {
                    cb(null, result);
                })
                .catch((err) => {
                    console.log(err);
                    return cb(err);
                });
        }
    }
    searchGroupModel(data, cb) {
        if (!data.filter) {
            this.groupDB
                .aggregate([{
                        $match: {
                            search_name: { $regex: data.params },
                        },
                    },
                    {
                        $addFields: { topicId: { $toObjectId: "$topic" } }
                    },
                    {
                        $lookup: {
                            from: 'tag',
                            localField: "topicId",
                            foreignField: "_id",
                            as: "tag"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            background: 1,
                            'tag.name': 1,
                            members: 1
                        },
                    },
                ])
                .toArray()
                .then((result) => {
                    console.log(result)
                    cb(null, result);
                })
                .catch((err) => {
                    console.log(err);
                    return cb(err);
                });
        } else {
            this.groupDB
                .aggregate([{
                        $match: {
                            $and: [
                                { search_name: { $regex: data.params } },
                                { topic: data.filter },
                            ],
                        },
                    },
                    {
                        $addFields: { topicId: { $toObjectId: "$topic" } }
                    },
                    {
                        $lookup: {
                            from: 'tag',
                            localField: "topicId",
                            foreignField: "_id",
                            as: "tag"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            background: 1,
                            'tag.name': 1,
                            members: 1
                        },
                    },
                ])
                .toArray()
                .then((result) => {
                    cb(null, result);
                })
                .catch((err) => {
                    console.log(err);
                    return cb(err);
                });
        }
    }
}

module.exports = new reportModel();