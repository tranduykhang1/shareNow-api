const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");

const conn = require("../../Connection/ConnectDB.js");

class userModel {
	getProfileModel(userId, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.findOne({ _id: ObjectId(userId) }, (err, result) => {
				if (err) return cb(new Error(err));
				else return cb(null, result);
			});
		});
	}
	updateProfileModel(userSchema, email, cb) {
		conn.then((db) => {
			console.log(userSchema);
			console.log(email);
			const userDB = db.collection("user");
			userDB.updateOne(
				{ email: email },
				{
					$set: {
						fullname: userSchema.full_name,
						username: userSchema.username,
						student_code: userSchema.student_code,
						industry: userSchema.industry,
						department: userSchema.department,
						class: userSchema.class,
						start_year: userSchema.start_year,
						end_year: userSchema.end_year,
					},
				},
				(err, result) => {
					if (err) return cb(new Error(err));
					else return cb(null, result);
				}
			);
		});
	}
	updateAvatarModel(data, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.updateOne(
				{ email: data.email },
				{ $set: { avatar: data.url } },
				(err, result) => {
					if (err) return cb(new Error(err));
					else return cb(null, result);
				}
			);
		});
	}
	updateBackgroundModel(data, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.updateOne(
				{ email: data.email },
				{ $set: { background: data.url } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, result);
				}
			);
		});
	}
	followUserModel(data, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB.findOne(
				{ _id: ObjectID(data.thisUser), following: data.otherUser },
				(err, result) => {
					if (err) return new Error(err);
					else {
						if (result) {
							userDB.updateOne(
								{ _id: ObjectID(data.thisUser) },
								{ $pull: { following: data.otherUser } },
								(err, result) => {
									if (result) {
										userDB.updateOne(
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
							userDB.updateOne(
								{ _id: ObjectID(data.thisUser) },
								{ $push: { following: data.otherUser } },
								(err, result) => {
									if (result) {
										userDB.updateOne(
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
					}
				}
			);
		});
	}
	listFollowingModel(userId, cb) {
		conn.then((db) => {
			const userDB = db.collection("user");
			userDB
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
				.then((result) => cb(null,result))
				.catch((err) => cb(err));
		});
	}
};


module.exports = new userModel()
