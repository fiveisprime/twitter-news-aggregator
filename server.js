var Hapi    = require('hapi')
  , request = require('request')
  , oauth   = require('./config').oauth
  , server;

//
// Search URL for twitter. This will gather the 100 most popular tweets that
//    include the #node hashtag.
//
var url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23node&result_type=mixed&count=100&lang=en';

server = Hapi.createServer('0.0.0.0', +process.env.PORT || 3000, {
  views: {
    path: 'views'
  , engines: {
      html: 'handlebars'
    }
  }
});

var getTweets = function(req) {
  request.get({ url: url, oauth: oauth }, function(err, response) {

    //
    // Will only fail when rate limited; at which point, the statuses array
    //    will be empty, but no error or failed status code will be provided.
    //

    var result = JSON.parse(response.body);
    req.reply.view('index.html', { tweets: result.statuses });
  });
};

//
// Expose the public directory to all routes so that views have access to
//    the resources in the public directory.
//
server.route({
  path: '/{path*}'
, method: 'GET'
, handler: {
    directory: {
      path: './public'
    , listing: false
    , index: true
    }
  }
});

server.route({
  path: '/'
, method: 'GET'
, handler: getTweets
});

server.start();
