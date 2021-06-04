const { v4: uuid } = require("uuid");
const commentSchema = require("../../Schema/Comment");
const likeShema = require("../../Schema/Like");
const interactModel = require("./Interact.model");

class Interactive {
	createComment(req, res) {
		const postId = req.body.post_id;
		commentSchema.id = uuid();
		commentSchema.comment_by.id = req.user._id;
		commentSchema.comment_by.name = req.user.fullname;
		commentSchema.comment_by.avatar = req.user.avatar;
		commentSchema.content = req.body.content;
		commentSchema.create_at = Date();
		commentSchema.reply_to = req.body.reply_to || null;

		interactModel.createCommentModel(postId, commentSchema, (err, result) => {
			return res.status(200).json(result);
		});
	}
	deleteComment(req, res) {
		const data = {
			postId: req.query.post_id,
			commentId: req.query.comment_id,
		};
		interactModel.deleteCommentModel(data, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	editComment(req, res) {
		const data = {
			postId: req.body.post_id,
			commentId: req.body.comment_id,
			content: req.body.content,
		};
		interactModel.editCommentModel(data, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	likePost(req, res) {
		const { post } = req.query;
		const data = {
			id: uuid(),
			user: req.user._id,
			name: req.user.fullname,
			avatar: req.user.avatar,
		};
		interactModel.likePostModel(post, data, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	unLikePost(req, res) {
		const data = {
			postId: req.query.post_id,
			likeId: req.query.like_id,
		};
		interactModel.unLikePostModel(data, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	getComment(req, res) {
		const { page, postId } = req.params;
		let limit = page * 5
		interactModel.getCommentsModel(limit, postId, (err,result) =>{
			if(err) return res.status(500).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new Interactive();
