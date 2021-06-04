const postSchema = {
	user: {
		id: "",
		name: "",
		avatar: "",
	},
	photos: [],
	create_at: "",
	caption: "",
	topic: "",
	tags: [],
	comments: [],
	likers: [],
	state: { locked: false },
};

exports.listPost = {
	_id: "",
	user: {
		id: "",
		name: "",
		avatar: "",
	},
	photos: [],
	create_at: "",
	caption: "",
	comments: [],
	likers: [],
	state: { locked: false },
};
module.exports = postSchema;
