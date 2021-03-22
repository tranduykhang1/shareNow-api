const { v4: uuid } = require("uuid");
const { postSchema, listPost } = require("../../Schema/Post");
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
		listPost.id = uuid();
		listPost.body = req.body.body;
		listPost.photos = urls;
		listPost.create_at = Date();
		listPost.tag = req.body.tag;
		postModel.userIsExist(userId, (err, user) => {
			if (err) {
				return res.status(403).json("Have a error!");
			} else {
				if (user) {
					postModel.insertNewPost(userId, listPost, (err, result) => {
						if (err) return res.status(403).json(err);
						return res.status(200).json(result);
					});
				} else {
					postSchema.user = req.user._id;
					postSchema.list.push(listPost);
					postModel.createPostModel(postSchema, (err, result) => {
						if (err) return res.status(403).json(err);
						return res.status(200).json(result);
					});
				}
			}
		});
	}
	updatePost(req, res) {
		const data = {
			id: req.body.post_id,
			body: req.body.body,
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
		postModel.postOfUser(id, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new Post();
