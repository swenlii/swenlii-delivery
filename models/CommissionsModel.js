var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
let emailModel = require('./EmailModel');
let authModel = require('./AuthModel');
let geoModel = require('./GeoModel');
let CONSTANTS = require('../CONSTANTS');
var slugify  = require('slugify');
var Big = require('big.js');

class CommissionsModel {
    constructor() {
    }

    async getUserComissions (id) {
        try {
            var commissions = await pool.query(`SELECT * FROM commissions WHERE userId = ?`, [id]);
        } catch (e) {
            throw e;
        }

        return commissions
    }

    async transactionCreate (obj) {
        for (var i = 0; i < obj.ordersId.length; i++){
            try {
                var commissions = await pool.query(`UPDATE commissions SET transactionId = ?, satatus = 'created' WHERE orderId = ?`, [obj.transId, obj.ordersId[i]]);
            } catch (e) {
                throw e;
            }
        }
        return 'ok';
    }

    async getCommission (id){
        try {
            var commissions = await pool.query(`SELECT * FROM commissions WHERE transactionId = ?`, [id]);
        } catch (e) {
            throw e;
        }

        return commissions[0]
    }

    async setTransactionCompleted (id){
        try {
            var commissions = await pool.query(`UPDATE commissions SET dateAlreadyPaid = NOW(), alreadyPaid = 1, satatus = 'completed' WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }
        return 'ok'
    }

    async setTransactionPending (id){
        try {
            var commissions = await pool.query(`UPDATE commissions SET satatus = 'pending' WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }
        return 'ok'
    }

    async setTransactionDeclined(id){
        try {
            var commissions = await pool.query(`UPDATE commissions SET satatus = 'declined' WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }
        return 'ok'
    }
}

module.exports = new CommissionsModel();