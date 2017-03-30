module.exports =  {
	updateUser:function(client, user, cb) {
		var sql = 'update User set name = ? , coins = ?,roomCards = ? , loginCount = , lastLoginTime = ? where id = ?';
		var args = [user.name, user.coins, user.roomCards, user.loginCount, user.lastLoginTime, user.uid];
		client.query(sql, args, function(err, res) {
			if(err !== null) {
				console.error('write mysql failed!　' + sql + ' ' + JSON.stringify(user) + ' stack:' + err.stack);
			}
      if(!!cb && typeof cb == 'function') {
        cb(!!err);
      }
		});
	}
};
