const roomSchema = {
    room_code: "",
    members: [],
    admin_key: "",
    name: "",
    create_at: "",
    message_list: [
        //messageSchema
    ],
};

const messageSchema = {
    message_id: "",
    sent_by: {
        id: "",
        avatar: "",
        full_name: ""
    },
    message_body: "",
    photos: [],
    sent_at: "",
    is_delete: false
};

module.exports = { roomSchema, messageSchema };