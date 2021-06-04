const conn = require("../../Connection/ConnectDB.js");
const { ObjectID } = require("mongodb");
const { v4: uuid } = require("uuid");

const {
	notificationSchema,
	notificationList,
} = require("../../Schema/Notifications.js");

class notificationModel {
	constructor() {
		conn.then((db) => {
			const notificationDB = db.collection("notification");
			this.notificationDB = notificationDB;
		});
	}
	async pushNotice(fromUser, userReceive, redirect_to, body, type, cb) {
		notificationSchema.user = userReceive;
		//
		notificationList.id = uuid();
		notificationList.from = fromUser;
		notificationList.type = type;
		notificationList.body = body;
		notificationList.redirect_to = redirect_to;
		notificationList.create_at = new Date();

		notificationSchema.notification_list.push(notificationList);
		conn.then((db) => {
			const notificationDb = db.collection("notification");
			notificationDb.findOne({ user: userReceive }, (err, user) => {
				if (err) return cb(new Error(err));
				if (!user) {
					notificationDb.insertOne(notificationSchema, (err, result) => {
						if (err) return cb(new Error(err));
						return cb(null, true);
					});
				} else {
					notificationDb.updateOne(
						{ user: userReceive },
						{ $push: { notification_list: notificationList } },
						(err, result) => {
							if (err) return console.log(err);
							return cb(null, true);
						}
					);
				}
			});
		});
	}
	updateStateNotice(noticeId, cb) {
		conn.then((db) => {
			const notificationDb = db.collection("notification");
			notificationDb.updateOne(
				{ "notification_list.id": noticeId },
				{ $set: { "notification_list.$.is_read": true } },
				(err, result) => {
					if (err) return cb(new Error(err));
					return cb(null, "Notification is read");
				}
			);
		});
	}
	getNotification(userId, cb) {
		this.notificationDB
			.aggregate([
				{
					$match: { user: userId },
				},
				{ $unwind: "$notification_list" },
				{
					$addFields: {
						user_id: { $toObjectId: "$notification_list.from" },
					},
				},
				{
					$lookup: {
						from: "user",
						localField: "user_id",
						foreignField: "_id",
						as: "users",
					},
				},
				{
					$project: {
						_id: 1,
						notification_list: 1,
						"users._id": 1,
						"users.full_name": 1,
						"users.avatar": 1,
					},
				},
			])
			.toArray()
			.then((result) => {
				result.sort((a,b) => new Date(b.notification_list.create_at) - new Date(a.notification_list.create_at))
				return cb(null, result);
			});
	}
	checkIsReadModel(user_id, cb) {
		this.notificationDB
			.findOne({
				user: user_id,
			})
			.then(async (result) => {
				let count = 0;
				await result.notification_list.map((notice) => {
					if (!notice.is_read) {
						count += 1;
					}
				});
				return cb(null, count);
			});
	}
}

module.exports = new notificationModel();
