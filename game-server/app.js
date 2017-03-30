var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'cardofpomelo-websocket');

// configure for global
app.configure('production|development', function() {
    app.loadConfig('mysql', app.getBase() + '/../shared/config/mysql.json');
  }
);

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3
    });
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});

// Configure database
app.configure('production|development', 'card|connector|master', function() {
  var dbclient = require('./app/card/mysql/mysql').init(app);
  app.set('dbclient', dbclient);
  app.use(sync, {sync: {path:__dirname + '/app/card/mapping', dbclient: dbclient}});
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
