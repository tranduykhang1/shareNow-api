const postSchema = {
	user: {
		id: "",
		name: "",
		avatar: "",
	},
	photos: [],
	create_at: "",
	caption: "",
	topics: [],
	tags: [],
	comments: [],
	likers: [],
	state: { locked: false },
};
module.exports = postSchema;
