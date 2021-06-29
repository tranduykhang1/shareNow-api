const { v4: uuid } = require("uuid");
const groupModel = require("./Group.model");
const groupSchema = require("../../Schema/Group");
const { regexStr } = require("../../Config/regex.config");
const { listPost } = require("../../Schema/Post");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");

class Group {
    async createGroup(req, res) {
        const userId = req.user._id;
        let url;
        const group_name = regexStr(req.body.name).toLowerCase();
        if (req.files) {
            const { tempFilePath } = req.files.photo;
            const upload = await cloudinaryUpload(tempFilePath, "/avatar");
            url = upload.url;
        }
        groupSchema.search_name = group_name;
        groupSchema.name = req.body.name;
        groupSchema.password = req.body.password;
        groupSchema.background = url;
        groupSchema.topic = req.body.topic;
        groupSchema.admin_key = userId;
        groupSchema.create_at = Date();
        groupSchema.members = [userId];

        groupModel.createGroupModel(groupSchema, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(201).json(result);
        });
    }
    groupDetail(req, res) {
        let { id } = req.params;

        groupModel.groupDetailModel(id, (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        });
    }
    deleteGroup(req, res) {
        const { group } = req.query;
        groupModel.deleteGroupModel(group, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }
    async updateBackgroundGroup(req, res) {
        const { tempFilePath } = req.files.photo;
        const upload = await cloudinaryUpload(tempFilePath, "/avatar");
        const data = {
            group_id: req.body.group_id,
            url: upload.url,
        };
        groupModel.updateBackgroundGroupModel(data, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(result);
        });
    }
    async updateGroup(req, res) {
        let url = req.body.photo;
        let searchName = regexStr(req.body.name);
        if (req.files) {
            const { tempFilePath } = req.files.photo;
            const upload = await cloudinaryUpload(tempFilePath, "/avatar");
            url = upload.url;
        }
        const data = {
            id: req.body.group_id,
            name: req.body.name,
            search_name: searchName,
            topic: req.body.topic,
            background: url,
        };
        groupModel.updateGroupModel(data, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(201).json(result);
        });
    }
    addMember(req, res) {
        let type = req.body.type;
        let data = {};
        if (type === "join") {
            data = {
                id: req.body.id,
                user: req.user._id,
                password: req.body.password,
            };
        }
        if (type === "add") {
            data = {
                id: req.body.id,
                user: req.body.user,
                password: req.body.password,
            };
        }

        groupModel.addMemberModel(data, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(201).json(result);
        });
    }
    removeMember(req, res) {
        const data = {
            id: req.query.id,
            user: req.query.user,
        };
        groupModel.removeMemberModel(data, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }
    checkUser(req, res) {
        let { group_id } = req.params;
        let user_id = req.user._id;
        groupModel.checkUserModel(group_id, user_id, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(result);
        });
    }
    usersInGroup(req, res) {
        const { group } = req.query;
    }
    membersInGroup(req, res) {
        const { group_id } = req.params;
        groupModel.membersInGroupModel(group_id, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json(result);
        });
    }
    allGroupByUser(req, res) {
        const { _id } = req.user;
        groupModel.groupByUserModel(_id, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }
    searchGroup(req, res) {
        const q = req.query.name.toLowerCase();
        groupModel.searchGroupModel(q, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }
    async createPost(req, res) {
        const urls = [],
            userId = req.user._id;
        if (req.files) {
            if (req.files.photos.length >= 2) {
                for (const file of req.files.photos) {
                    const { tempFilePath } = file;
                    const newUrl = await cloudinaryUpload(
                        tempFilePath,
                        "/post-photos"
                    );
                    urls.push(newUrl.url);
                }
            } else {
                const { tempFilePath } = req.files.photos;
                const newUrl = await cloudinaryUpload(tempFilePath, "/post-photos");
                urls.push(newUrl.url);
            }
        }
        const groupId = req.body.groupId;
        let listPost = {
            _id: uuid(),
            user: {
                id: req.user._id,
                avatar: req.user.avatar,
                name: req.user.full_name,
            },
            caption: req.body.caption,
            photos: urls,
            comments: [],
            likers: [],
            create_at: Date(),
        };
        groupModel.createNewPostModel(groupId, listPost, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }
    newsInGroup(req, res) {
        let { group_id } = req.params;
        groupModel.newsInGroupModel(group_id, (err, result) => {
            if (err) return res.status(500).json(err);
            console.log("oke")
            return res.json(result);
        });
    }
    groupNews(req, res) {
        let userId = req.user._id;
        console.log("oke")
        groupModel.groupNewsModel(userId, (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json(result);
        });
    }
}

module.exports = new Group();