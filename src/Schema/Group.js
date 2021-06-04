const groupSchema = {
	name: "",
	search_name: "",
	password: "",
	background: "",
	topic: "",
	members:[], 
	admin_key: "",
	post: [], 
	create_at: "",
	state: {locked: false},
};

module.exports = groupSchema;
