var app = require('express')()
var http = require('http').server(app)
var io = require('socket.io') (http)

app.get('/', function(req,res){
	res.sendfile('index.html')
	
})

io.on('connection', function(socket){
	console.log('user connected')
	socket.on('chat message', function(message){
		io.emit('chat message', message)
	})
	
	socket.on('disconnect', function(){
		console.log('user disconnected')
	})
	
})

http.listen(3000, function(){
	console.log('listening on *:3000') 
})