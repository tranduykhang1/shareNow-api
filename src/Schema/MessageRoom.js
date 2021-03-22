const roomSchema = {
	room_code: "",
	members: [],
	admin_key: "",
	name: "",
	create_at: "",
	messages: [
		//messageSchema
	],
};

const messageSchema = {
	id: "",
	to: "",
	body: "",
	send_at: ""
};

module.exports = { roomSchema, messageSchema };
