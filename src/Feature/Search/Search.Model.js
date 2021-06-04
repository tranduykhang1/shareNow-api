const conn = require("../../Connection/ConnectDB");
const { ObjectID } = require("mongodb");

class reportModel {
	constructor() {
		conn.then((db) => {
			const groupDB = db.collection("group");
			const userDB = db.collection("user");
			this.groupDB = groupDB;
			this.userDB = userDB;
		});
	}

	searchAllModel(data, cb) {
		let resp = [];
		if (!data.filter) {
			this.userDB
				.find({
					search_name: { $regex: data.params },
				})
				.toArray()
				.then((result) => {
					resp.push(result);
					this.groupDB
						.find({
							search_name: { $regex: data.params },
						})
						.toArray()
						.then((result) => {
							result.map((res) => resp.push(res));
							cb(null, resp);
						});
				});
		} else {
			this.userDB
				.find({
					$or: [
						{ search_name: { $regex: data.params } },
						{ department: data.filter },
					],
				})
				.toArray()
				.then((result) => {
					resp.push(result);
					this.group
						.find({
							$or: [
								{ search_name: { $regex: data.params } },
								{ topic: data.filter },
							],
						})
						.toArray()
						.then((result) => {
							result.map((res) => resp.push(res));
							cb(null, resp);
						})
						.catch((err) => {
							return cb(err);
						});
				})
				.catch((err) => {
					return cb(err);
				});
		}
	}
	searchUserModel(data, cb) {
		this.userDB
			.find({
				$or: [
					{ search_name: { $regex: data.params } },
					{ department: data.filter },
				],
			})
			.toArray()
			.then((result) => {
				cb(null, result);
			})
			.catch((err) => {
				console.log(err);
				return cb(err);
			});
	}
	searchGroupModel(data, cb) {
		if (!data.topic) {
			this.groupDB
				.aggregate([
					{
						$match: {
							search_name: { $regex: data.params },
						},
					},
					{
						$project: {
							_id: 1,
							name: 1,
							background: 1,
							topic: 1,
						},
					},
				])
				.toArray()
				.then((result) => {
					cb(null, result);
				})
				.catch((err) => {
					console.log(err);
					return cb(err);
				});
		}
		this.groupDB
			.aggregate([
				{
					$match: {
						$and: [
							{ search_name: { $regex: data.params } },
							{ topic: data.filter },
						],
					},
				},
				{
					$project: {
						_id: 1,
						name: 1,
						background: 1,
						topic: 1,
					},
				},
			])
			.toArray()
			.then((result) => {
				cb(null, result);
			})
			.catch((err) => {
				console.log(err);
				return cb(err);
			});
	}
}

module.exports = new reportModel();
