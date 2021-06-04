const notificationModel = require("./Notification.model.js");

class notification {
	readNotification(req, res) {
		let { notification_id } = req.params;
		notificationModel.updateStateNotice(notification_id, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	getNotification(req, res) {
		let user_id = req.user._id
		notificationModel.getNotification(user_id, (err, result) => {
			if (err) return res.status(500).json(err);
			return res.status(200).json(result);
		});
	}
	readedList(req,res){
		let user_id = req.user._id
		notificationModel.checkIsReadModel(user_id, (err,result) =>{
			if(err) return res.status(500).json(err)
			return res.status(200).json(result)
		})
	}
}

module.exports = new notification();
