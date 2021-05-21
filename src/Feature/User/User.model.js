const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB.js");

class userModel {
	constructor() {
		conn.then((db) => {
			const userDB = db.collection("user");
			this.userDB = userDB;
		});
	}
	confirmUserModel(id,data, cb) {
		let {
			department,
			industry,
			course,
			class_room,
			student_code,
			student_type,
		} = data;
		this.userDB.updateOne(
			{ _id: ObjectID(userId) },
			{
				$set: {
					student_code: student_code,
					student_type: student_type,
					department: department,
					industry: industry,
					class_room: class_room,
					course: course,
					"state.active": true
				},
			},
			(err, result) => {
				if (err) return cb(new Error(err));
				return cb(null, "User is active")
			}
		);
	}
	getProfileModel(userId, cb) {
		this.userDB.findOne({ _id: ObjectID(userId) }, (err, result) => {
			if (err) return cb(new Error(err));
			return cb(null, result);
		});
	}
	updateProfileModel(userSchema, email, cb) {
		this.userDB.updateOne(
			{ email: email },
			{
				$set: {
					fullname: userSchema.full_name,
					username: userSchema.username,
					from: userSchema.from,
					birthday: userSchema.birthday,
					gender: userSchema.gender,
					student_type: userSchema.student_type,
					student_code: userSchema.student_code,
					department: userSchema.department,
					industry: userSchema.industry,
					course: userSchema.course,
					class_room: userSchema.class_room.toUpperCase(),
					bio: userSchema.bio
				},
			},
			(err, result) => {
				if (err) return cb(new Error(err));
				else return cb(null, result);
			}
		);
	}
	updateAvatarModel(data, cb) {
		this.userDB.updateOne(
			{ email: data.email },
			{ $set: { avatar: data.url } },
			(err, result) => {
				if (err) return cb(new Error(err));
				else return cb(null, result);
			}
		);
	}
	updateBackgroundModel(data, cb) {
		this.userDB.updateOne(
			{ email: data.email },
			{ $set: { background: data.url } },
			(err, result) => {
				if (err) return cb(new Error(err));
				return cb(null, result);
			}
		);
	}
	followUserModel(data, cb) {
		this.userDB.findOne(
			{ _id: ObjectID(data.thisUser), following: data.otherUser },
			(err, result) => {
				if (err) return new Error(err);
				else {
					if (result) {
						this.userDB.updateOne(
							{ _id: ObjectID(data.thisUser) },
							{ $pull: { following: data.otherUser } },
							(err, result) => {
								if (result) {
									this.userDB.updateOne(
										{ _id: ObjectID(data.otherUser) },
										{ $pull: { followers: data.thisUser } },
										(err, result) => {
											if (result) {
												return cb(null, "unFollow this user!");
											}
										}
									);
								}
							}
						);
					} else {
						this.userDB.updateOne(
							{ _id: ObjectID(data.thisUser) },
							{ $push: { following: data.otherUser } },
							(err, result) => {
								if (result) {
									this.userDB.updateOne(
										{ _id: ObjectID(data.otherUser) },
										{ $push: { followers: data.thisUser } },
										(err, result) => {
											if (result) {
												return cb(null, "Following this user!");
											}
										}
									);
								}
							}
						);
					}
					//update notifications
				}
			}
		);
	}
	listFollowingModel(userId, cb) {
		this.userDB
			.aggregate([
				{ $match: { _id: ObjectID(userId) } },
				{ $unwind: "$following" },
				{ $addFields: { userId: { $toObjectId: "$following" } } },
				{
					$lookup: {
						from: "user",
						localField: "userId",
						foreignField: "_id",
						as: "users",
					},
				},
				{
					$project: {
						"users._id": 1,
						"users.avatar": 1,
						"users.fullname": 1,
					},
				},
			])
			.toArray()
			.then((result) => cb(null, result))
			.catch((err) => cb(err));
	}
	onlineStateModel(userId) {
		this.userDB.updateOne(
			{
				_id: ObjectID(userId),
			},
			{ $set: { "state.online": true } }
		);
	}
	offlineStateModel(userId) {
		this.userDB.updateOne(
			{
				_id: ObjectID(userId),
			},
			{ $set: { "state.online": false } }
		);
	}
}

module.exports = new userModel();
