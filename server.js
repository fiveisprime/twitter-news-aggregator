var Hapi    = require('hapi')
  , request = require('request')
  , util    = require('util')
  , oauth   = require('./config').oauth
  , server;

var templateUrl = 'https://api.twitter.com/1.1/search/tweets.json?q=%s&result_type=mixed&count=100&lang=en';

server = Hapi.createServer('0.0.0.0', +process.env.PORT || 3000, {
  views: {
    path: 'views'
  , engines: {
      html: 'handlebars'
    }
  }
});

var getTweets = function(req) {
  var url = null;
  if (req.query.q) {
    url = util.format(templateUrl, encodeURIComponent(req.query.q));
  } else {
    url = util.format(templateUrl, '%23node');
  }

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
