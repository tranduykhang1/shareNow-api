const app = require("express")(),
	bodyParser = require("body-parser"),
	cookieSession = require("cookie-session"),
	upload = require("express-fileupload"),
	cors = require("cors"),
	PORT = process.ENV || 1234;
//socket configuration
const http = require("http").createServer(app),
	io = require("socket.io")(http, {
		cors: {
			origin: '*'
		},
		 allowEIO3: true 
	});

socketServer = require("./src/socketIO/io");
socketServer(io);

//
app.use(cors())
app.use(
	upload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: ["key1", "key2"],
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
const Auth = require("./src/Feature/Auth/Auth.route.js"),
	User = require("./src/Feature/User/User.route.js"),
	Group = require("./src/Feature/Group/Group.route.js"),
	Post = require("./src/Feature/Post/Post.route.js"),
	Message = require("./src/Feature/Message/Message.route.js"),
	MessageRoom = require("./src/Feature/MessageRoom/MessageRoom.route.js"),
	Interact = require("./src/Feature/Interact/Interact.route.js"),
	Admin = require("./src/Feature/Admin/Admin.route.js"),
	Report = require("./src/Feature/Report/Report.route.js");
	Notification = require("./src/Feature/Notification/Notification.route.js");
	Curriculum = require("./src/Feature/TheCurriculum/Curriculum.route.js");
	Notification = require("./src/Feature/Notification/Notification.route.js");
	Search = require("./src/Feature/Search/Search.route.js");



app.use("/auth", Auth);
app.use("/user", User);
app.use("/group", Group);
app.use("/post", Post);
app.use("/message", Message);
app.use("/room", MessageRoom);
app.use("/interact", Interact);
app.use("/report", Report);
app.use("/admin", Admin);
app.use("/notification", Notification);
app.use("/curriculum", Curriculum);
app.use("/notification", Notification);
app.use("/search", Search);




http.listen(PORT);
