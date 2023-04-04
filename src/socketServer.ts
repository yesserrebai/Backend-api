interface User {
    id: string;
    socketId: string;
}

interface Admin {
    id: string;
    socketId: string;
}let users: User[] = [];let admins: Admin[] = [];

const SocketServer = (socket:any) => {
    //#region //!Connection
    socket.on("joinUser", (id: string) => {
        users.push({ id, socketId: socket.id });
    });

    socket.on("joinAdmin", (id: string) => {
        admins.push({ id, socketId: socket.id });
        const admin = admins.find((admin) => admin.id === id);
        let totalActiveUsers = users.length;

        socket.to(`${admin?.socketId}`).emit("activeUsers", totalActiveUsers);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socketId !== socket.id);
        admins = admins.filter((user) => user.socketId !== socket.id);
    });

    //#endregion

    //#region //!Like
    socket.on("likePost", (newPost: { user: { followers: any; _id: any; }; }) => {
        let ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("likeToClient", newPost);
            });
        }
    });

    socket.on("unLikePost", (newPost: { user: { followers: any; _id: any; }; }) => {
        let ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
            });
        }
    });
    //#endregion

    //#region //!comment
    socket.on("createComment", (newPost: { user: { followers: any; _id: any; }; }) => {
        let ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
            });
        }
    });

    socket.on("deleteComment", (newPost: { user: { followers: any; _id: any; }; }) => {
        let ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
            });
        }
    });
    //#endregion

    //#region //!follow

    socket.on("follow", (newUser: { _id: string; }) => {
        const user = users.find((user) => user.id === newUser._id);
        user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
    });

    socket.on("unFollow", (newUser: { _id: string; }) => {
        const user = users.find((user) => user.id === newUser._id);
        user && socket.to(`${user.socketId}`).emit("unFollowToClient", newUser);
    });
    //#endregion

    //#region //!Notifications

    socket.on("createNotify", (msg: { recipients: string | string[]; }) => {
        const clients = users.filter((user) => msg.recipients.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
            });
        }
    });

    socket.on("removeNotify", (msg: { recipients: string | string[]; }) => {
        const clients = users.filter((user) => msg.recipients.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
            });
        }
    });

    //#endregion

    socket.on("getActiveUsers", (id: string) => {
        const admin = admins.find((user) => user.id === id);
        const totalActiveUsers = users.length;

        socket
            .to(`${admin.socketId}`)
            .emit("getActiveUsersToClient", totalActiveUsers);
    });

    //#region //!Messages

    socket.on("addMessage", (msg: any) => {
        const user = users.find(user => user.id === msg.recipient);
        user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    });

    //#endregion
}

export default SocketServer;
