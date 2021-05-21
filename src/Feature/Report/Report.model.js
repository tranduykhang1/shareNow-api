const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class reportModel {

	constructor() {
		conn.then((db) => {
			const reportDB = db.collection("report");
			this.reportDB = reportDB;
		});
	}

	reportModel(_id, schema, data, cb) {
		conn.then((db) => {
			reportDB.findOne(
				{ "body.id": _id, "body.type": schema.body.type },
				(err, account) => {
					if (err) return cb(err);
					else {
						if (account) {
							reportDB.updateOne(
								{ "body.id": _id },
								{ $push: { report_by: data } },
								(err, result) => {
									if (err) return cb(err);
									return cb(null, "Reported");
								}
							);
							return;
						}
						reportDB.insertOne(
							schema,
							{ forceServerObjectId: true },
							(err, result) => {
								if (err) return cb(err);
								return cb(null, "Insert new report data");
							}
						);
					}
				}
			);
		});
	}
	reportedAccountsModel(cb) {
		conn.then((db) => {
			reportDB
				.aggregate([
					{ $match: { "body.type": "account" } },
					{ $addFields: { userId: { $toObjectId: "$body.id" } } },
					{
						$lookup: {
							from: "user",
							localField: "userId",
							foreignField: "_id",
							as: "account",
						},
					},
					{
						$project: {
							report_by: 1,
							id: "$account._id",
							name: "$account.fullname",
							avatar: "$account.avatar",
						},
					},
				])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
		});
	}
	reportedPostsModel(cb) {
		conn.then((db) => {
			reportDB
				.aggregate([
					{ $match: { "body.type": "post" } },
					{ $addFields: { postId: { $toObjectId: "$body.id" } } },
					{
						$lookup: {
							from: "post",
							localField: "postId",
							foreignField: "_id",
							as: "post",
						},
					},
					{
						$project: {
							report_by: 1,
							post:1 
						},
					},
				])
				.toArray()
				.then((result) => cb(null, result))
				.catch((err) => cb(err));
		});
	}
}

module.exports = new reportModel();
