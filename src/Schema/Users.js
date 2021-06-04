const userSchema = {
	method: "",
	email: "",
	password: "",
	full_name: "",
	search_name: "",
	username: "",
	gender: "",
	birthday: "",
	from: "",
	avatar: "",
	background: "",
	student_code: "",
	industry: "",
	department: "",
	class_room: "",
	course: "",
	followers: [], 
	following: [],
	state: { online: false, active: false, locked: false }, 
	type: "",
	bio: "",
	create_at: ""
}

module.exports = userSchema
