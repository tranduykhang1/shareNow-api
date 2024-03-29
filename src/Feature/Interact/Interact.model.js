const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");
const notificationModel = require("../Notification/Notification.model");

class interactiveModel {
    constructor() {
        conn.then((db) => {
            const postDB = db.collection("post");
            const groupDB = db.collection("group");

            this.postDB = postDB;
            this.groupDB = groupDB;

        });
    }
    createCommentModel(postId, data, cb) {
        this.postDB.findOneAndUpdate({ _id: ObjectID(postId) }, { $push: { comments: data } },
            (err, result) => {
                if (err) return cb(err);
                //update notifications
                let userRepsonse = result.value;
                notificationModel.pushNotice(
                    data.comment_by.id,
                    userRepsonse.user.id,
                    postId,
                    "đã bình luận bài viết",
                    "comment",
                    (err, result) => {
                        if (err) return cb(err);
                        //socket handler
                        return cb(null, "Posted");
                    }
                );
            }
        );
    }
    deleteCommentModel(data, cb) {
        this.postDB.findOneAndUpdate({ _id: ObjectID(data.postId) }, { $pull: { comments: { id: data.commentId } } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "Comment was deleted!");
            }
        );
    }
    editCommentModel(data, cb) {
        this.postDB.updateOne({
                "comments.id": data.commentId,
            }, { $set: { "comments.$.content": data.content } },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return cb(err);
                }
                return cb(null, "Comment was edited!");
            }
        );
    }
    likePostModel(postId, data, cb) {
        this.postDB.findOneAndUpdate({
                _id: ObjectID(postId),
            }, { $push: { likers: data } },
            (err, result) => {
                if (err) return cb(err);
                //update notifications
                let userRepsonse = result.value;
                notificationModel.pushNotice(
                    data.user,
                    userRepsonse.user.id,
                    postId,
                    "đã quan tâm bài viết",
                    "like",
                    (err, result) => {
                        if (err) return cb(err);
                        //socket handler
                        return cb(null, "Care this post");
                    }
                );
                //
            }
        );
    }
    unLikePostModel(data, cb) {
        console.log(data);
        this.postDB.updateOne({
                _id: ObjectID(data.postId),
            }, { $pull: { likers: { id: data.likeId } } },
            (err, result) => {
                if (err) return cb(err);
                return cb(null, "unLike this post!");
            }
        );
    }
    getCommentsModel(postId, cb) {
        this.postDB
            .aggregate([{ $match: { _id: ObjectID(postId) } },
                { $project: { comments: 1 } }
            ])
            .toArray()
            .then((result) => cb(null, result))
            .catch((err) => cb(err));
    }


    // comment post in group, like post in group
    commentPostInGroupModel(postId, data, cb) {
        this.groupDB.updateOne({ "post._id": postId }, { $push: { 'post.$.comments': data } }).then(result => cb(null, "Comment was posted"))
    }

    getCommentInGroupModel(postId, cb) {
        this.groupDB.aggregate([
            { $unwind: '$post' },
            { $match: { "post._id": postId } },
            {
                $project: {
                    "post.comments": 1
                }
            }
        ]).toArray().then(result => cb(null, result[0]))
    }

    likePostInGroupModel(postId, data, cb) {
        this.groupDB.updateOne({ "post._id": postId }, { $push: { "post.$.likers": data } }, (err, result) => {
            if (err) return cb(err)
            return cb(null, "Like post!")
        })
    }
    unLikePostInGroupModel(data, cb) {
        this.groupDB.updateOne({ "post.likers.id": data.likeId }, {
            $pull: { 'post.likers.$.id': data.likeId }
        }, (err, result) => {
            if (err) console.log(err)
            return cb(null, "unLike post!")
        })
    }
}

module.exports = new interactiveModel();