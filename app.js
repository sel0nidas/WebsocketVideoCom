const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, { cors: '*' });

const port = process.env.port || 8000;

app.use(cors());

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/qr', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});


app.get('/qr2', (req, res, next) => {
	res.sendFile(path.join(__dirname, 'qrcodeTest.html'));
  });

app.use(express.static(__dirname, {
  extensions: ["html", "htm", "gif", "png", "js"],
}));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.on("join room", (id) => {
    socket.join(id);
    console.log(id);
  });
  socket.on("video message", (a) => {
    console.log(a);
	if(a.roomId != null)
    socket.to(a.roomId).emit("video message", a);
	else
    socket.broadcast.to(a).emit("video message", a);
    // Uncomment the following code if you want to save the data to a file
    /*
    if (a.playerstate == 1 || a.playerstate == 2 || a.playerstate == -1 || a.playerstate == 3) {
      let data = JSON.stringify(a) + "\n";
      fs.appendFile('./data.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });
    }
    */
  });
  /*
  socket.on("video read", (a) => {
    io.to(socket.id).emit("video read", fs.readFileSync('./data.json', 'utf-8'));
  });
  */
});

http.listen(port, ["127.0.0.1", "192.168.1.200"], () => {
  console.log("Server started");
});
