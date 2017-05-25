var path = require('path')
var models = require('../DBScema')
var bodyParser = require('body-parser')

module.exports = function(app,io)
{
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({
		extended: true
	}))
	
	app.get('/', function(req,res){
		
		res.sendFile(path.resolve(__dirname+"../../Client"))
	})
	
	app.post('/register', function(req,res){
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
		var user = {
			name: req.body.name,
			handle: req.body.handle,
			phone: req.body.phone,
			password: req.body.password,
			email: req.body.email
		}
		
		models.user.findOne({handle: req.body.handle}, function(err,doc){
			if(err){
                res.json(err); 
            }
			if(!doc)
			{
				models.user.create(user,function(err,doc){
					if(err){
                res.json(err); 
                }
				
				else{
					res.send('success')
				}
			 
				})
			}
			else{
				res.send('user already exist')
			}
		})
		
	})
	
	var handle = null, private = null, users = {}, keys = {} 
	
	app.post('/login',function(req,res){
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        handle = req.body.handle;
		models.user.findOne((handle: req.body.handle, password: req.body.password), function(err,doc){
		  if(err)
           res.send(err)
          if(doc==null){
                res.send("User has not registered");
            }
            else{
                console.log("Asas"+__dirname);
//                res.sendFile(path.resolve(__dirname+"/../views/chat1.html"));
                res.send("success");
            }		  
		  
		})
	})
	
	
	io.on('connection',function(socket){
		io.to(socket.it).emit('handle', handle)
		users[handle] = socket.id
		keys[socket.id] = handle
		models.user.find({"handle": handle},{friends:1,_id:0},function(err,doc){
			
			if(err)
			res.send(err)
             
            else{
				friends=[]
				pending=[]
				all_friends=[]
				list=doc[0].friends.slice()
				
				for(var i in list)
				{
					if(list[i].status == 'Friend')
						friends.push(list[i].name)
					else if(list[i].status == 'Pending')
						pending.push(list[i].name)
				}
				
				io.to(socket.id).emit('friend_list',friends)
				io.to(socket.id).emit('pending_list',friends)
			}			 
			
		})
		
		socket.on('group message',function(msg){
			io.emit('group', msg)
		})
		
		socket.on('private message',function(msg){
			console.log('message  :'+msg.split("#*@")[0]);
			models.message.create({
				message: msg.split("#*@")[1],
				sender: msg.split("#*@")[2],
				receiver: msg.split("#*@")[0],
				date: new date()	
			})
			
			io.to(users[msg.split("#*@")[0]]).emit('private message',msg)
			
		})
		
		socket.on('disconnect', function(){
			delete users[keys[socket.id]];
            delete keys[socket.id];
            io.emit('users',users);
            console.log(users);
		})		
	})
	
	
	app.post('/friend_request',function(req,res){
		res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        friend=true;
		models.user.find({"handle":req.body.my_handle,"friends.name":req.body.friend_handle},function(err,doc){
			if(err)
				res.send(err)
			else if(doc.length){
				res.send('friend request already send')
			}
			
			else{
				model.user.update({"handle":req.body.my_handle},{
					$push: {
						friends:{
							name: req.body.friend_handle,
							status: 'pending'
						}
					},{
						upsert:true
					},function(err,docs){
						if(err){res.json(err);}
                    //            else{
                    //                console.log(doc);
                    //   
					
				})
				io.to(users[req.body.friend_handle]).emit('message',req.body)
			}
			
		})
		
	})
	
	app.post('/friend_request/confirmed', function(req,res){
		res.setHeader("Access-Control-Allow-Origin", '*')
		res.setHeader("Acess-Control-Allow-Method", 'GET,POST,PATCH,PUT,OPTIONS,DELETE')
		if(req.body.confirm == 'yes')
		{
			models.user.find({"handle":req.body.my_handle,"friends.name":req.body.friend_handle},function(err,doc){
			
				else if(doc.length){
					res.send('friend request already accepted')
				}				
				else{
					model.user.update({"handle":req.body.my_handle,"friends.name":req.body.friend_handle},{
						'$set': {
							'friends.$.status': 'Friend'
						}
					},function(err,doc){
						if(err) res.send(err)
						else{
							io.to(users[req.body.friend_handle]).emit('friend', req.body.my_handle);
							io.emit(users[req.body.my_handle]).emit('friend',req.body.friend_handle)
						}	
					})
					
				   models.user.update({"handle":req.body.friend_handle},{
					   '$push': {
						   name: res.body.my_handle,
						   status: "Friend"
					   }
				   },function(err,doc){
					   if(err) res.send(err)
						   
				   })	
				}
		  })
		}
		
		else{
			model.user.update({"handle":req.body.my_handle},{
				'$pull': {
					'friends':{
						'name': req.body.friend_handle
					}
				}
			},function(err,doc){
				if(err) res.send(err)
			})
		}
		
	})
	
	
}