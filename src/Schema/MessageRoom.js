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
	message_id: "",
	sent_by: "",
	message_content: "",
	photos: [],
	sent_at: "",
	is_delete: false
};

module.exports = { roomSchema, messageSchema };
