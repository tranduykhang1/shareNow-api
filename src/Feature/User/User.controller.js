const userModel = require("./User.model.js");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");

module.exports = {
	getProfile(req, res) {
		const { id } = req.query;
		let userId;
		if (id) {
			userId = id;
		} else {
			userId = req.user._id;
		}
		userModel.getProfileModel(userId, (err, result) => {
			if (err) return res.status(403).json("User not found or error");
			else return res.status(200).json(result);
		});
	},
	updateProfile(req, res) {
		const { email } = req.user;
		userModel.updateProfileModel(req.body, email, (err, result) => {
			if (err)
				return res.status(403).json("Update fail! Something went wrong.");
			return res.status(200).json("Update success!");
		});
	},
	async updateAvatar(req, res) {
		const { path } = req.file;
		const upload = await cloudinaryUpload(path, "/avatar");
		const data = {
			email: req.user.email,
			url: upload.url,
		};
		userModel.updateAvatarModel(data, (err, result) => {
			if (err) return res.status(403).json("Avatar update fail!");
			return res.status(200).json("Avatar updated!");
		});
	},
	async updateBackground(req, res) {
		const { path } = req.file;
		const upload = await cloudinaryUpload(path, '/background')
		const data = {
			email: req.user.email,
			url: upload.url
		}
		userModel.updateBackgroundModel(data, (err,result) =>{
			if(err) return res.status(403).json("Background update fail!")
			return res.status(200).json("Background updated!")
		})
	},
	followUser(req,res){
		const thisUser = req.user._id;
		const otherUser = req.query.user;
		const data = {
			thisUser: thisUser,
			otherUser: otherUser
		}
		userModel.followUserModel(data, (err, result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	},
	listFollowing(req,res){
		const {_id} = req.user
		userModel.listFollowingModel(_id, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
};










