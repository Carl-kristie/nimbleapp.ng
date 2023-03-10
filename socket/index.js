const io = require("socket.io")(4000, {
  cors: {
    origin: ["https://3000-carlkristie-chatapp-jj95vqv1xiz.ws-eu89b.gitpod.io/adminhome"]
  }
});

io.on("connection", (socket) => {
  console.log("hello there")
});
