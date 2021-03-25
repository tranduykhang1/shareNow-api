const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const upload = require("express-fileUpload");
const app = express();

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

const Auth = require("./src/Feature/Auth/Auth.route.js");
const User = require("./src/Feature/User/User.route.js");
const Group = require("./src/Feature/Group/Group.route.js");
const Post = require("./src/Feature/Post/Post.route.js");
const Message = require("./src/Feature/Message/Message.route.js");
const MessageRoom = require("./src/Feature/MessageRoom/MessageRoom.route.js");
const Interact = require("./src/Feature/Interact/Interact.route.js");
const Admin = require("./src/Feature/Admin/Admin.route.js");

app.use("/auth", Auth);
app.use("/user", User);
app.use("/group", Group);
app.use("/post", Post);
app.use("/message", Message);
app.use("/room", MessageRoom);
app.use("/interact", Interact);
app.use("/admin", Admin);

app.listen(process.env.PORT || 1234);
