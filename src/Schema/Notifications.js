const notificationSchema = {
	user: "",
	notification_list: [],
};
const notificationList = {
	id: "",
	from: "",
	type: "",
	body: "",
	is_read: false,
	redirect_to: "",
	create_at: "",
};

module.exports = { notificationSchema, notificationList };
