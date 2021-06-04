const { v4: uuid } = require("uuid");
const randomize = require("randomatic");
const messageRoomModel = require("./MessageRoom.Model");
const { roomSchema, messageSchema } = require("../../Schema/MessageRoom");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");


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
	async newMessageRoom(req, res) {
		const { roomId } = req.body,
			{ message_body } = req.body,
			user = req.user._id;
		const urls = [];

		if (req.files) {
			if (req.files.photos.length >= 2) {
				for (const file of req.files.photos) {
					const { tempFilePath } = file;
					const newUrl = await cloudinaryUpload(
						tempFilePath,
						"/message-photos"
					);
					urls.push(newUrl.url);
				}
			} else {
				const { tempFilePath } = req.files.photos;
				const newUrl = await cloudinaryUpload(tempFilePath, "/message-photos");
				urls.push(newUrl.url);
			}
		}


		messageSchema.message_id = uuid();
		messageSchema.send_by = user;
		messageSchema.messge_content = message_body;
		messageSchema.photos = urls;
		messageSchema.sent_at = Date();

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
		messageRoomModel.getRoomMembersModel(room, (err, result) => {
			return res.status(200).json(result);
		});
	}
	joinRoom(req, res) {
		const data = {
			room: req.query.room,
			user: req.user._id,
		};

		messageRoomModel.joinRoomModel(data, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	leaveRoom(req, res) {
		const data = {
			room: req.query.room,
			user: req.user._id,
		};
		messageRoomModel.leaveRoomModel(data, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
	destroyRoom(req, res) {
		const { room } = req.query;
		messageRoomModel.destroyRoomModel(room, (err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new messageRoom();
