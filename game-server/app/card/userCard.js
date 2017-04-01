var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var User = require('../domain/user');
var async = require('async');
var utils = require('../util/utils');

var userCard = module.exports;

/**
   * get user infomation by userId
 * @param {String} uid UserId
 * @param {function} cb Callback function
 */
userCard.getUserByUid = function (uid, cb){
	var sql = 'select * from	User where id = ?';
	var args = [uid];
	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
			utils.invokeCallback(cb,err.message, null);
			return;
		}

		if (!!res && res.length > 0) {
			utils.invokeCallback(cb, null, new User(res[0]));
		} else {
			utils.invokeCallback(cb, ' user not exist ', null);
		}
	});
};

/**
 * delete user by uid
 * @param {String} username
 * @param {function} cb Call back function.
 */
userCard.deleteByUid = function (uid, cb){
	var sql = 'delete from	User where uid = ?';
	var args = [uid];
	pomelo.app.get('dbclient').query(sql,args,function(err, res){
		if(err !== null){
				utils.invokeCallback(cb,err.message, null);
		} else {
			if (!!res && res.affectedRows>0) {
				utils.invokeCallback(cb,null,true);
			} else {
				utils.invokeCallback(cb,null,false);
			}
		}
	});
};

/**
 * Create a new user
 * @param (String) name
 * @param {String} from Register source
 * @param {function} cb Call back function.
 */
userCard.createUser = function (name, from, cb){
	var sql = 'insert into User (name,`from`,coins,roomCards,loginCount,lastLoginTime) values(?,?,?,?,?)';
	var loginTime = Date.now();
	var args = [name, from || '', 1000, 100, 1, loginTime];
	pomelo.app.get('dbclient').insert(sql, args, function(err,res){
		if(err !== null){
			utils.invokeCallback(cb, {code: err.number, msg: err.message}, null);
		} else {
			var user = new User({uid: res.insertId, name: name, coins: res.coins, roomCards: res.roomCards, loginCount: 1, lastLoginTime:loginTime});
			utils.invokeCallback(cb, null, user);
		}
	});
};
