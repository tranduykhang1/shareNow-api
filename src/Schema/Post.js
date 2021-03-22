const postSchema = {
	user: "",
	list: [],
};
const listPost = {
	id: "",
	photos: [],
	create_at: "",
	body: "",
	tag: "",
	comments: [],
	emoji: [],
	state: { locked: false },
};
module.exports = { postSchema, listPost, };
