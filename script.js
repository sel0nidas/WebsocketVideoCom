var socket = io("http://localhost:8000", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
    })
    
  function connect() {
      socket.emit("video message","deneme");
  }
      