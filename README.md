Live Tweet Stream
=================

Create an interactive live twitter stream to be display on your big crowd event / conference.

Installation
------------

1. Clone this repository
```
git clone https://github.com/faizshukri/tweetstream.git
```

2. Install dependencies
```
cd tweetstream/
npm install
bower install
```

3. Configure Twitter API keys. You have to create Twitter application at http://dev.twitter.com, and write API key and Access Token to `api/config/twitter.js`. You may copy / rename from `twitter.sample.js` inside that folder.
```javascript
var keys = {
    consumer_key:         'API Key',
    consumer_secret:      'API Secret',
    access_token:         'Access Token',
    access_token_secret:  'Access Token Secret'
};
```

4. Fire up the socket server
```
node api/server.js
```

5. Start streaming from `app/index.html`. :)
```
http://localhost/tweetstream/app/
```

6. (Optional). You can build using grunt to utilize the code. Make sure you have grunt-cli installed on your machine.
```
grunt build
```

License
-------
Release under MIT

Authors
-------
Faiz Shukri [ [@faizshudin](http://twitter.com/faizshudin) ]
