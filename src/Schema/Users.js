const userSchema = {
	method: "",
	email: "",
	password: "",
	fullname: "",
	username: "",
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
