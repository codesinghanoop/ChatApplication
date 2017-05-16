var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connection.on(ref, function(ref){
	console.log('connected to mongo server')
})

mongoose.connection.on(err, function(ref){
	console.log('Db can not be connected')
	console.log(err);
})

module.exports.user = mongoose.model('User', new Schema({
	name: String,
	handle: String,
	password: String,
	phone: String,
	email: String,
	friends: []
    }, {strict: false} ))
	
module.exports.online = mongoose.model( 'online', new Schema({
	handle: String,
	connection.id: String
	
})
)	

module.exports.messages = mongoose.model('message', new Schema ({
	message: String,
	sender: String,
    receiver: String,
    date: date	
})	
)

