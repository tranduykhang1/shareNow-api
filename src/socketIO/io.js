const { v4: uuid } = require("uuid");
const { getDataToken } = require("../Config/jwt");

const realtimeDB = require("./RealtimeDB");
const constants = require("./Constants"),
    userModel = require("../Feature/User/User.model.js"),
    messageModel = require("../Feature/Message/Message.model"),
    messageRoomModel = require('../Feature/MessageRoom/MessageRoom.model')

module.exports = (io) => {
    let users = [],
        currentUser = {},
        rooms = {};

    io.on("connection", (socket) => {
        socket.on(constants.POST_COMMENT, (data) => {
            console.log(data);
            socket.emit(constants.UPLOAD_POST, data);
        });
        // follow + like

        // socket.on(constants.JOIN_ROOM, async(token) => {
        //     const result = await getDataToken(token);
        //     socket.emit(constants.JOIN_ROOM, result);
        // });
        // socket.on(constants.LEAVE_ROOM, async(token) => {
        //     const result = await getDataToken(token);
        //     socket.emit(constants.LEAVE_ROOM, result);
        // });



        //change state user (online or offline)
        socket.on(constants.NEW_USER, async(token) => {
            currentUser = await getDataToken(token);
            if (currentUser) {
                users[currentUser._id] = socket.id;
                userModel.onlineStateModel(currentUser._id);
                messageRoomModel.getRoomsByUser(currentUser._id, (err, result) => {
                    if (err) console.log(err)
                    if (result) {
                        result.map(room => {
                            socket.join("room-" + room._id)
                        })
                    }
                })
                socket.on("disconnect", () => {
                    userModel.offlineStateModel(currentUser._id);
                });

                /* get room of User and store in rooms
                if user in room => join to room */

            }


        });
        socket.on(constants.TYPING, (data) => {
            let socketId = users[data.receiver];
            socket.to(socketId).emit(constants.TYPING, {
                userId: data.sender,
                status: data.status
            });
            // socket.emit(constants.TYPING, data.status)
        });

        socket.on(constants.ROOM_MESSAGE, (data) => {
            // io.emit(constants.ROOM_MESSAGE)
            io.sockets.in('room-' + data).emit(constants.ROOM_MESSAGE)
        })
        socket.on(constants.SEND_MESSAGE, (data) => {
            console.log('oke')
            let socketId = users[data];
            socket.to(socketId).emit(constants.SEND_MESSAGE)
        });
    });
};