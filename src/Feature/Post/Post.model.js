const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");
class postModel {
    constructor() {
        conn.then((db) => {
            const postDB = db.collection("post");
            const groupDB = db.collection("group");
            this.postDB = postDB;
            this.groupDB = groupDB;
        });
    }
    createPostModel(data, cb) {
        this.postDB.insertOne(
            data, { forceServerObjectId: true },
            (err, result) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, "Upload success!");
            }
        );
    }
    updatePostModel(data, cb) {
        this.postDB.updateOne({ _id: ObjectID(data.id) }, {
                $set: {
                    caption: data.caption,
                    tags: data.tag,
                    topic: data.topic
                },
            },
            (err, result) => {
                if (err) {
                    return cb("Update fail!");
                }
                return cb(null, "Update success!");
            }
        );
    }
    deletePostModel(postId, cb) {
            this.postDB.deleteOne({ _id: ObjectID(postId) }, (err, result) => {
                if (err) return cb(err);
                return cb(null, "Post was deleted!");
            });
        }
        /*userIsExist(userId, cb) {
        	conn.then((db) => {
        		const postDB = db.collection("post");
        		postDB.findOne({ user: userId }, (err, result) => {
        			if (err) return cb("Have a error!!");
        			return cb(null, result);
        		});
        	});
        }
        insertNewPost(userId, data, cb) {
        	conn.then((db) => {
        		const postDB = db.collection("post");
        		postDB.updateOne(
        			{ user: userId },
        			{ $push: { list: data } },
        			(err, result) => {
        				if (err) return cb("Update user error!");
        				return cb(null, "Inserted new post!");
        			}
        		);
        	});
        }
        */
    allOfPostsModel(user_id, limit, cb) {
        this.postDB
            .aggregate([
                { $sort: { _id: -1 } },
                { $limit: limit },
                { $addFields: { tag_id: { $toObjectId: "$tags" } } },
                { $addFields: { topic_id: { $toObjectId: "$topic" } } },
                {
                    $lookup: {
                        from: "tag",
                        localField: "tag_id",
                        foreignField: "_id",
                        as: "tag",
                    },
                },
                {
                    $lookup: {
                        from: "department",
                        localField: "topic_id",
                        foreignField: "_id",
                        as: "topic",
                    },
                },
            ])
            .toArray()
            .then((post) => {
                return cb(null, post)
            })
            .catch((err) => {
                console.log(err)
                return cb(err)
            });

        /* this.postDB
        	.aggregate([{ $limit: limit }, { $sort: { create_at: 1 } }])
        	.toArray()
        	.then((post) => {
        		postList = post;
        		//
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
        				{ $limit: limit },
        				{ $sort: { "post.create_at": 1 } },
        			])
        			.toArray()
        			.then(async (news) => {
        				news.map((post) => postList.push(post));
        				await postList.sort(
        					(a, b) => new Date(b.create_at) - new Date(a.create_at)
        				);
        				return cb(null, postList);
        			});
        	})
        	.catch((err) => cb(err));
        	*/
    }
    postOfUser(userId, cb) {
            this.postDB
                .aggregate([
                    { $match: { "user.id": userId } },
                    { $addFields: { tag_id: { $toObjectId: "$tags" } } },
                    { $addFields: { topic_id: { $toObjectId: "$topic" } } },
                    {
                        $lookup: {
                            from: "tag",
                            localField: "tag_id",
                            foreignField: "_id",
                            as: "tag",
                        },
                    },
                    {
                        $lookup: {
                            from: "department",
                            localField: "topic_id",
                            foreignField: "_id",
                            as: "topic",
                        },
                    },
                    // { $sort: { $natural: -1 } },
                ])
                .toArray()
                .then((result) => cb(null, result))
                .catch((err) => console.log(err));
        }
        /*
        getPostByTopicModel(department, cb) {
        	this.postDB
        		.aggregate([{ $match: { department: department } }])
        		.toArray()
        		.then((result) => cb(null, result))
        		.catch((err) => cb(err));
        }
        */
    filterPostModel(topic, tag, cb) {
        console.log(topic, tag)
        if (topic === "false" || tag === "false") {
            this.postDB
                .aggregate([{
                        $match: { $or: [{ tags: tag }, { topic: topic }] }
                    },
                    { $addFields: { tag_id: { $toObjectId: "$tags" } } },
                    { $addFields: { topic_id: { $toObjectId: "$topic" } } },
                    {
                        $lookup: {
                            from: "tag",
                            localField: "tag_id",
                            foreignField: "_id",
                            as: "tag",
                        },
                    },
                    {
                        $lookup: {
                            from: "department",
                            localField: "topic_id",
                            foreignField: "_id",
                            as: "topic",
                        },
                    },
                ])
                .toArray()
                .then((post) => {
                    post.sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
                    return cb(null, post)
                })
                .catch((err) => cb(err));
        }
        if (tag !== "false" && topic !== "false") {
            this.postDB
                .aggregate([
                    { $match: { $and: [{ topic: topic }, { tags: tag }] } },
                    { $addFields: { tag_id: { $toObjectId: "$tags" } } },
                    { $addFields: { topic_id: { $toObjectId: "$topic" } } },
                    {
                        $lookup: {
                            from: "tag",
                            localField: "tag_id",
                            foreignField: "_id",
                            as: "tag",
                        },
                    },
                    {
                        $lookup: {
                            from: "department",
                            localField: "topic_id",
                            foreignField: "_id",
                            as: "topic",
                        },
                    },
                ])
                .toArray()
                .then((post) => {
                    post.sort((a, b) => new Date(b.create_at) - new Date(a.create_at))
                    return cb(null, post)
                })
                .catch((err) => cb(err));
        }

    }

    getPhotosByUserModel(userId, cb) {
        this.postDB.aggregate([
            { $match: { 'user.id': userId } },
            { $unwind: "$photo" }
        ]).toArray().then(result => cb(null, result))
    }
}

module.exports = new postModel();