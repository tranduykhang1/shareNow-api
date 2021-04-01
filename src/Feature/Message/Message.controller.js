const { v4: uuid } = require("uuid");

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
	newMessage(req, res) {
		const { conversation_id } = req.body;
		const data = {
			message_id: uuid(),
			message_body: req.body.message,
			send_by: req.user._id,
			send_at: Date(),
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
