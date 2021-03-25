const postSchema = {
	user: {
		id: "",
		name: "",
		avatar: "",
	},
	photos: [],
	create_at: "",
	caption: "",
	tag: "",
	comments: [],
	likers: [],
	state: { locked: false },
};
module.exports = postSchema;
