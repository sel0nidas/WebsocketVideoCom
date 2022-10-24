const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3000 })

var rooms = {};

function createID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


const paramsExist = (data) =>{
  try {
    if('roomID' in data && 'clientID' in data && 'message' in data){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    return false;
  }
}

const roomExist = (roomID) =>{
    // check for room is already exist or not
    if(roomID in rooms){
      return true;
    }else{
      return false;
    }
}
const insideRoomdataExist = (arr,data) =>{
    var status = false;
    for(var i =0; i<arr.length;i++){
      if(data in arr[i]){
        status= true;
        break;
      }
    }
    return status;
  }

  const clientExistInRoom = (roomID,ws,clientID) =>{
    var status = false;
    const data = rooms[roomID];
    for(var i =0; i< data.length ;i++){
      var temp = data[i];
      // if(roomID in temp){
      //   status=true;
      //   console.log("hello world");
      // }
      for(const obj in temp){
        // if(ws == temp[obj]){
        if(clientID == obj){
          status = true;
          break;
        }
      }
    }return status;
  }

  // create room
const createRoom =(data,ws)=>{
    try {
      var {roomID,clientID} = data;
      const status = roomExist(roomID);
      if(status){
        ws.send(JSON.stringify({
              'message':'room already exist',
              'status':0
            }));
      }else{
        rooms[roomID] = [];
        var obj = {};
        obj[clientID] = ws;
        rooms[roomID].push(obj);
        ws['roomID']=roomID;
        ws['clientID']=clientID;
        ws['admin']=true;
        ws.send(JSON.stringify({
          'message':'room created succesfully',
          'status':1
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        'message':'there was some problem in creating a room',
        'status':0
      }));
    }
  }
  
  // join room 
  const joinRoom = (data,ws) => {
    try {
      var {roomID,clientID} = data;
      // check if room exist or not
      const roomExist = roomID in rooms;
      if(!roomExist){
        ws.send(JSON.stringify({
          'message':'Check room id',
          'status':0
        }));
        return;
      }
      // const inRoom = insideRoomdataExist(rooms[roomID],clientID);
      const inRoom = clientExistInRoom(roomID,ws,clientID)
      if(inRoom){
        ws.send(JSON.stringify({
          "message":"you are already in a room",
          "status":0
        }));
      }else{
        var obj = {};
        obj[clientID] = ws;
        rooms[roomID].push(obj);
        ws['roomID']=roomID
        ws['clientID']=clientID;
        ws.send(JSON.stringify({
        "message":"Joined succesfully",
        "status":1
      }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        'message':'there was some problem in joining a room',
        'status':0
      }));
    }
  }
  
  // send message 
  const sendMessage = (data,ws,Status=null) => {
    try {
      var {roomID, message,clientID} = data;
      //check whether room exist or not
      const roomExist = roomID in rooms;
      if(!roomExist){
        ws.send(JSON.stringify({
          'message':'Check room id',
          'status':0
        }));
        return;
      }
      // check whether client is in room or not
      const clientExist = clientExistInRoom(roomID,ws,clientID);
      
      const obj = rooms[roomID];
      for(i=0;i<obj.length;i++){
        var temp = obj[i];
        for(var innerObject in temp){
          var wsClientID = temp[innerObject];
          if(ws!==wsClientID){
            console.log(wsClientID)
            wsClientID.send(JSON.stringify({
              'message': message
            }));
          }
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({
        'message':'There was some problem in sending message',
        'status':0
      }));
    }
  }


wss.on('connection', (ws) => {
  console.log("a user connected")
  ws.on('message', (message) => {
    
    console.log("message wanted")
    message = JSON.parse(message);
    if(paramsExist(message) == true){
      console.log(message.choice);
      if(message.choice == "sendMessage"){
        console.table(message.message)
        sendMessage(message, ws, null);
      }
      else if(message.choice == "leave"){
        
        var indexD = rooms[ws['roomID']]
        .findIndex(element => {
          if(element[ws['clientID']])
            console.log("We Find The Right")
        });
        console.log(indexD)
        rooms[ws['roomID']].splice(indexD, 1);

      }
      else{

      if(!roomExist(message.roomID)){
        /*
        message.clientID = createID(8);
        rooms.push({roomID: message.roomID, users: [{clientID: message.clientID}] });
        */
        
        message.clientID = ""+createID(8);
        createRoom(message, ws);
      }
      else{
        /*
        var roomIndex = users.findIndex((element) => element.roomID == message.roomID);
        rooms[roomIndex].users.push({clientID: message.clientID});
        */
       
        message.clientID = ""+createID(8);
        joinRoom(message, ws);
      }
      if(ws.admin)
        ws.send(JSON.stringify({
          'message':'ADMİNSİN LAN'
        }));
      else{
        ws.send(JSON.stringify({
          'message':'normalsin'
        }));
      }
      }
      
      

    }

    else
      ws.send("Unusable data, please try again!")

  })
  ws.on('close', ()=>{
    console.log("User Passed Away...");
    /*

    var index = rooms[ws['roomID']].findIndex((element) => element[0] == ws)
    */
    //rooms[ws[roomId]].slice(0, index);
  })
  setInterval(()=>{
    ws.send(JSON.stringify({
      'message':'ping'
    }));
    console.table(rooms)
  },10000)
})
