const { v4: uuid } = require("uuid");
const randomize = require("randomatic");
const messageRoomModel = require("./MessageRoom.Model");
const { roomSchema, messageSchema } = require("../../Schema/MessageRoom");

class messageRoom {
	createRoom(req, res) {
		const { room_name } = req.body,
			user = req.user._id;
		roomSchema.room_code = randomize("A)", 6);
		roomSchema.name = room_name;
		roomSchema.admin_key = user;
		roomSchema.members = [user];
		roomSchema.create_at = Date();

		messageRoomModel.createRoomModel(roomSchema, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	newMessageRoom(req, res) {
		const { roomId } = req.body,
			{ body } = req.body,
			user = req.user._id;
		messageSchema.id = uuid();
		messageSchema.to = user;
		messageSchema.body = body;
		messageSchema.send_at = Date();

		messageRoomModel.newMessageRoomModel(
			roomId,
			messageSchema,
			(err, result) => {
				if (err) return res.status(403).json(err);
				return res.status(200).json(result);
			}
		);
	}
	deleteMessageRoom(req, res) {
		const { msg_id } = req.query;
		messageRoomModel.deleteMsgRoomModel(msg_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	getRoomMembers(req, res) {
		const { room } = req.query;
		messageRoomModel.getRoomMembersModel(room, (err,result) =>{
			return res.status(200).json(result)
		})
	}
}

module.exports = new messageRoom();
