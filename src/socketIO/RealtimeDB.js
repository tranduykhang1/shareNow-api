
const conn = require("../Connection/ConnectDB"),
	{ ReplSet } = require("mongodb-topology-manager"),
	mongod = require("mongod");

class realtimeDB {
	constructor(io) {
		this.io = io;
	}
	

	async postStream() {

		conn.then((db) => {
			const post = db.collection("post");
			const changeStream = post.watch();
			changeStream.on("change", (next) => {
				console.log("received a change to the collection: \t", next);
			});
		});
	}
}
module.exports = realtimeDB;
