const express = require('express'); 
const cors = require('cors'); 
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, {cors: '*', credentials: true});

const port = process.env.port || 8000 ;

app.use(cors());

app.get(('/test'), (req, res, next) => {
    res.send("asd");
});


io.on("connection", (socket) => {
	
	console.log("a user connected");

	socket.on("video message",(a)=>{
		socket.broadcast.emit("video message",a)	
		/*
		if(a.playerstate == 1 || a.playerstate == 2 || a.playerstate == -1 || a.playerstate == 3){
		
			let data = JSON.stringify(a) + "\n"; //          

            fs.appendFile('./data.json', data, (err) => {  
                if (err) throw err;
                console.log('Data written to file');
            });
		}
		*/
	})
	/*
	socket.on("video read", (a)=>{
		io.to(socket.id).emit("video read", fs.readFileSync('./data.json', 'utf-8'))
	})
	*/
});


http.listen(port, () => {
	console.log("Eventually, started");
})
