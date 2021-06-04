const { v4: uuid } = require("uuid");
const { cloudinaryUpload } = require("../../Config/cloudinary.config");

const messageSchema = require("../../Schema/Message");
const messageModel = require("./Message.model");


class Message {
	createConversation(req, res) {
		messageSchema.users = [req.body.to, req.body.from]
		messageModel.createConversationModel(messageSchema, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	deleteConversation() {}
	async newMessage(req, res) {
		const { conversation_id } = req.body;
		const urls = [];

		if(req.files) {
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

		const data = {
			message_id: uuid(),
			message_body: req.body.message_body,
			photos: urls,
			sent_by: req.user._id,
			sent_at: Date(),
		};
		messageModel.newMessageModel(data, conversation_id, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	deleteMessage(req, res) {
		const { conversation_id } = req.query,
			{ message_id } = req.query,
			data = {
				cv_id: conversation_id,
				msg_id: message_id,
			};
		messageModel.deleteMessageModel(data, (err, result) => {
			if (err) return res.status(403).json(err);
			return res.status(200).json(result);
		});
	}
	getMessage(req, res) {
		const data = {
			from: req.user._id,
			to: req.query.to,
		}
		messageModel.getMessageModel(data,(err,result) =>{
			if(err) return res.status(403).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new Message();
