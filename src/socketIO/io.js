const { v4: uuid } = require("uuid");
const { getDataToken } = require("../Config/jwt");

const constants = require("./Constants"),
	userModel = require("../Feature/User/User.model.js"),
	messageModel = require("../Feature/Message/Message.model");

module.exports = (io) => {
	let users = [],
		currentUser = {};

	io.on("connection", (socket) => {
		socket.on(constants.UPLOAD_POST, (data) => {
			console.log(data);
			socket.emit(constants.UPLOAD_POST, data);
		});
		socket.on(constants.POST_COMMENT, (data) => {
			console.log(data);
			socket.emit(constants.UPLOAD_POST, data);
		});
		socket.on(constants.JOIN_ROOM, async (token) => {
			const result = await getDataToken(token);
			socket.emit(constants.JOIN_ROOM, result);
		});
		socket.on(constants.LEAVE_ROOM, async (token) => {
			const result = await getDataToken(token);
			socket.emit(constants.LEAVE_ROOM, result);
		});
		socket.on(constants.TYPING, (data) => {
			let socketId = users[data.id]
			//socket.to(socketId).emit(constants.TYPING, "");
			io.emit(constants.TYPING, "")
		});
		//change state user (online or offline)
		socket.on(constants.NEW_USER, (token) => {
			currentUser = getDataToken(token);

			users[currentUser._id] = socket.id;
			userModel.onlineStateModel(currentUser._id);
			socket.on("disconnect", () => {
				userModel.offlineStateModel(currentUser._id);
			});
		});
		socket.on(constants.SEND_MESSAGE, (data) => {
			let socketId = users(data.id)
			const msgData = {
				message_id: uuid(),
				message_body: data.message_body,
				send_by: currentUser._id,
				send_at: Date(),
			};
			messageModel.newMessageModel(msgData, data.id, (err, result) => {
				if (result) {
					socket.to(socketId).emit(constants.SEND_MESSAGE, msgData);
					socketId.emit(constants.SEND_MESSAGE, msgData)
				}
			});
		});
	});
};
