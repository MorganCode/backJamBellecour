const app = require("express")();
let server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("disconnect", function() {
    io.emit("users-changed", { user: socket.username, event: "left" });
  });

  socket.on("set-name", name => {
    socket.username = name;
    io.emit("users-changed", { user: name, event: "joined" });
  });

  socket.on("send-message", message => {
    io.emit("message", {
      msg: message.text,
      user: socket.username,
      createdAt: new Date()
    });
  });

  socket.on("send-move", ({ x, y }) => {
    console.log("move received");
    io.emit("move", {
      x: x,
      y: y,
      user: socket.username
    });
  });
});

var port = process.env.PORT || 4444;

server.listen(port, function() {
  console.log("listening in http://localhost:" + port);
});
