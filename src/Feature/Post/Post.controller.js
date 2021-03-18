const postSchema = require("../../Models/Post");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");
const postModel = require("./post.model");

class Post {
	async createPost(req, res) {
		const urls = [];
		for (const file of req.files.photos) {
			const {  tempFilePath } = file;
			const newUrl = await cloudinaryUpload(tempFilePath, "/post-photos");
			urls.push(newUrl.url);
		}
		postSchema.user = req.user._id;
		postSchema.body = req.body.body;
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
			body: req.body.body,
			tag: req.body.tag
		}
		postModel.updatePostModel(data, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
	deletePost(req, res) {
		const {id} = req.query
		postModel.deletePostModel(id, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new Post();
