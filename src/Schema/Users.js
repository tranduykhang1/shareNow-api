const userSchema = {
	method: "",
	email: "",
	password: "",
	fullname: "",
	username: "",
	avatar: "",
	background: "",
	student_code: "",
	industry: "",
	department: "",
	class: "",
	start_year: "",
	end_year: "",
	followers: [], 
	following: [],
	state: { online: false, active: false, locked: false }, 
	type: ""
}

module.exports = userSchema
