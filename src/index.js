const app = require("express")();
let server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("disconnect", function() {
    io.emit("users-changed", {
      user: socket.username,
      event: "left",
      players: getAllPlayers()
    });
  });

  socket.on("set-name", name => {
    socket.username = name;
    io.emit("users-changed", {
      user: socket.username,
      event: "joined",
      players: getAllPlayers()
    });
  });

  socket.on("start-game", name => {
    io.emit("startGame");
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

function getAllPlayers() {
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID) {
    var player = io.sockets.connected[socketID].player;
    if (player) players.push(player);
  });
  return players.length;
}

var port = process.env.PORT || 4444;

server.listen(port, function() {
  console.log("listening in http://localhost:" + port);
});
