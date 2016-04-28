var express = require('express');
var router = express.Router();
var Client = require('node-xmpp-client');
var queue = [];

router.get('/', function(req, res, next){
	res.render('index')
})

router.post('/message', function(req, res, next){
	queue.push(req.body.message)
	//sending message over xmpp
	xmppmessage(req.body.outgoing)
	res.status(201).send()
	next()
})

function xmppmessage(to){

	//creating the client
	//I used lightwitch but any xmpp server would work
	//sidenote: i used Adium chat to check that this app works (that's how the client.on('online') event gets triggered)
	var client = new Client({jid: 'XMPP CLIENT', password: 'PASSWORD'})

	//great for debugging; shows events like auth, online and offline;
	//uncomment out the console logs to see the emitting events
	var oldEmit = client.emit;

	client.emit = function(){
		var emitargs = arguments;
		// console.log("EMITARGS", emitargs)
		oldEmit.apply(client, arguments);
	}

	//error handling
	client.connection.socket.on('error', function (error) {
	  console.error(error)
	})

	client.on('online', function (data) {

		//sends all the messages that were sent by the client
		//useful if messages were attempted when internet connection was lost
		//and so the online event wasn't triggered
		//a database like Redis could also be used here instead 
	    queue.forEach(function(message){

		    var stanza = new Client.Stanza('message', {to: to, type: 'chat'})
		      .c('body').t(message)
		    
		    client.send(stanza)
	    })

	    //clear the queue after we send all the messages in it
	    queue=[];

	  // nodejs has nothing left to do and will exit
	  	client.end();
	})

	//error handling
	client.on('error', function (error) {
	  console.error(error)
	})
}

module.exports = router;