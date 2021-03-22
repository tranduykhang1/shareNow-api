const {v4: uuid} = require('uuid')

const groupModel = require("./Group.model");
const groupSchema = require("../../Schema/Group");
const { regexStr } = require("../../Config/regex.config");
const { listPost } = require("../../Schema/Post");
const {cloudinaryUpload} = require('../../Config/cloudinary.config');


class Group {
	createGroup(req, res) {
		const userId = req.user._id;

		const group_name = regexStr(req.body.name).toLowerCase();

		groupSchema.search_name = group_name;
		groupSchema.name = req.body.name;
		groupSchema.topic = req.body.topic;
		groupSchema.admin_key = userId;
		groupSchema.create_at = Date();
		groupSchema.members = [userId];
		groupSchema.state = "private";

		groupModel.createGroupModel(groupSchema, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(201).json(result);
		});
	}
	deleteGroup(req, res) {
		const { group } = req.query;
		groupModel.deleteGroupModel(group, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	updateGroup(req, res) {
		const data = {
			id: req.body.id,
			name: req.body.name,
			topic: req.body.topic,
		};
		groupModel.updateGroupModel(data, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(201).json(result);
		});
	}
	addMember(req, res) {
		const data = {
			id: req.body.id,
			user: req.body.user,
		};
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
	usersInGroup(req, res) {
		const { group } = req.query;
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

		if (req.files.photos.length >= 2) {
			for (const file of req.files.photos) {
				const { tempFilePath } = file;
				const newUrl = await cloudinaryUpload(tempFilePath, "/post-photos");
				urls.push(newUrl.url);
			}
		} else {
			const { tempFilePath } = req.files.photos;
			const newUrl = await cloudinaryUpload(tempFilePath, "/post-photos");
			urls.push(newUrl.url);
		}
		const groupId = req.body.groupId;
		listPost.id = uuid();
		listPost.body = req.body.body;
		listPost.tag = req.body.tag;
		listPost.photos = urls
		listPost.create_at = Date();
		
		groupModel.createNewPostModel(groupId, listPost, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new Group();
