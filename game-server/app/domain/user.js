/**
 *Module dependencies
 */

var util = require('util');

/**
 * Initialize a new 'User' with the given 'opts'.
 *
 * @param {Object} opts
 * @api public
 */

var User = function(opts) {
	this.uid = opts.uid;
	this.name = opts.name;
	this.coins = opts.coins;
	this.roomCards = opts.roomCards
	this.loginCount = opts.loginCount;
	this.lastLoginTime = opts.lastLoginTime;
};

/**
 * Expose 'Entity' constructor
 */

module.exports = User;
