const { v4: uuid } = require("uuid");
const postSchema = require("../../Schema/Post");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");
const postModel = require("./post.model");

class Post {
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
        //check

        postSchema.user.id = req.user._id;
        postSchema.user.name = req.user.full_name;
        postSchema.user.avatar = req.user.avatar;
        postSchema.caption = req.body.caption;
        postSchema.photos = urls;
        postSchema.create_at = Date();
        postSchema.topic = req.body.topic;
        postSchema.tags = req.body.tag;

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


    allOfPosts(req, res) {
        let { page } = req.params;
        let user_id = req.user._id;
        let limit = page * 6;
        postModel.allOfPostsModel(user_id, limit, (err, result) => {
            if (err) return res.status(403).json(err);
            return res.status(200).json(result);
        });
    }

    getUsersPost(req, res) {
            const { id } = req.params;
            postModel.postOfUser(id, (err, result) => {
                if (err) return res.status(403).json(err);
                return res.status(200).json(result);
            });
        }
        /*
        getPostByTopic(req, res) {
        	const { topic } = req.query;
        	postModel.getPostByTopicModel(topic, (err, result) => {
        		if (err) return res.status(403).json(err);
        		return res.status(200).json(result);
        	});
        }
        */
    filterPost(req, res) {
        const { tag, topic } = req.query;
        postModel.filterPostModel(topic, tag, (err, result) => {
            if (err) return res.json(err);
            return res.status(200).json(result);
        });
    }

    getPhotoByUser(req, res) {
        const userId = req.user._id;
        postModel.getPhotosByUserModel(userId, (err, result) => {
            if (err) return res.json(err);
            return res.status(200).json(result);
        });
    }
}

module.exports = new Post();