var mysql = require('mysql');
let mysql2 = require('mysql2');
var util = require('util');
let CONSTANTS = require('../CONSTANTS');

class DBConnectionModel {
    constructor() {
        this.pool = null;
    }

    returnPoolConnection() {
        var error = null;
        if (!this.pool) {
            var pool  = mysql.createPool({
                connectionLimit : 10,
                connectTimeout: 10000,
                acquireTimeout: 10000,
                host     : CONSTANTS.DBHost,
                user     : CONSTANTS.DBUser,    // localz
                password : CONSTANTS.DBPassword,
                database : CONSTANTS.DBName
                //debug: ['ComQueryPacket']	// SQL in C
            });
            pool.query = util.promisify(pool.query);
            this.pool = pool
            //console.log('returned NEW pool connection')
            return pool;
        } else {
            //console.log('returned INITALIZED pool connection')
            return this.pool;
        }
    }
}
module.exports = new DBConnectionModel();
