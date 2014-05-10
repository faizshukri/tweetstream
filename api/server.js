var io = require('socket.io').listen(3000);
var Twit = require('twit');
var crypto = require('crypto');
var util = require('util');

var TWEETS_BUFFER_SIZE = 3;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var SOCKETIO_FILTER = 'tweet-io:filter';

var T = new Twit(require('./config/twitter'));

io.sockets.on('connection', function(socket){

    socket.tweets = [];

    socket.on(SOCKETIO_START_EVENT, function(data){
        var roomName = getRoomName(data.filter);
        console.log('set roomname: '+roomName);
        socket.set('roomName', roomName);
        socket.join( roomName );
        startClient(data.filter, socket);
    });

    socket.on('disconnect', function(){
        stopClient(socket);
    });

});

function stopClient(socket){
    if(socket.stream) socket.stream.stop();
    socket.get('roomName', function(err, name){
        socket.leave(name);
    });
}

function broadCast(socket){
    socket.get('roomName', function(err, name){
        console.log('broadcast to '+name);
        console.log('with tweets: '+util.inspect(socket.tweets));
        io.sockets.in(name).emit('tweets', socket.tweets);
    });
}

function startClient(filter, socket){

    console.log('filter: '+util.inspect(filter));

    socket.stream = T.stream('statuses/filter', filter );

    socket.stream.on('connect', function(request){
        console.log('Connected to Twitter API');
    });

    socket.stream.on('disconnect', function(message){
        console.log('Disconnected from Twitter API. Message: ' + message);
    });

    socket.stream.on('reconnect', function (request, response, connectInterval) {
        console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
    });

    socket.stream.on('tweet', function(tweet){
        console.log('got tweet');
        var msg = {};

        msg.id = tweet.id;
        msg.text = tweet.text;
        msg.user = {
            name: tweet.user.name,
            image: tweet.user.profile_image_url.replace('_normal.','_bigger.')
        }

        socket.tweets.push(msg);
        if(socket.tweets.length == 3){
            broadCast(socket);
            socket.tweets = [];
        }
    });
}

function getRoomName(filter){
    return crypto.createHash('md5').update( JSON.stringify(filter) ).digest('hex').slice(0,5);
}