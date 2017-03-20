module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * 创建房间
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.createRoom = function(msg, session, next) {
	var self = this;
	var uid = msg.uid;
	var rid = msg.uid + "*" + "1";
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel
	self.app.rpc.card.cardRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users,
			rid:rid
		});
	});
};

/**
 * 进入房间
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.enterRoom = function(msg, session, next) {
	var self = this;
	var rid = msg.rid;
	var uid = msg.uid;
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel
	self.app.rpc.card.cardRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users,
			rid:rid
		});
	});
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.card.cardRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};

/**
 * 离开房间
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.leaveRoom = function(msg, session, next) {
	var rid = msg.rid;
	var uid = msg.uid;
	app.rpc.card.cardRemote.kick(session, uid, app.get('serverId'), rid, null);
	next(null);
};
