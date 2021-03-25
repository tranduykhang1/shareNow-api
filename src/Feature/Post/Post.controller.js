const { v4: uuid } = require("uuid");
const postSchema = require("../../Schema/Post");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");
const postModel = require("./post.model");

class Post {
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

		//check
		
		postSchema.user.id = req.user._id
		postSchema.user.name = req.user.fullname
		postSchema.user.avatar = req.user.avatar
		postSchema.caption = req.body.caption;
		postSchema.photos = urls;
		postSchema.create_at = Date();
		postSchema.tag = req.body.tag;

		postModel.createPostModel(postSchema, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	updatePost(req, res) {
		const data = {
			id: req.body.post_id,
			caption: req.body.caption,
			tag: req.body.tag,
		};
		postModel.updatePostModel(data, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	deletePost(req, res) {
		const { id } = req.query;
		postModel.deletePostModel(id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	getUsersPost(req, res) {
		const { id } = req.query;
		postModel.postOfUser(id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
}

module.exports = new Post();
