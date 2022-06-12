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

class ReviewsModel {
    constructor() {
    }

    async getForRewiewsPage(userId){
        try {
            var myReviews = await pool.query(`SELECT reviews.*, users.name, users.avatarPath, users.id AS user_id, orders.title, orders.slug, DATE_FORMAT(orders.completeDate, '%k:%i, %d %M %Y') AS dateComplete, DATE_FORMAT(reviews.datePost, '%k:%i, %d %M %Y') AS dateReview FROM reviews LEFT JOIN users ON reviews.toUserId = users.id LEFT JOIN orders ON reviews.orderId = orders.id WHERE fromUserId = ?`, [userId]);
        } catch (e) {
            throw e;
        }

        try {
            var reviewsForMe = await pool.query(`SELECT reviews.*, users.name, users.avatarPath, users.id AS user_id, orders.title, orders.slug, DATE_FORMAT(orders.completeDate, '%k:%i, %d %M %Y') AS dateComplete, DATE_FORMAT(reviews.datePost, '%k:%i, %d %M %Y') AS dateReview FROM reviews LEFT JOIN users ON reviews.fromUserId = users.id LEFT JOIN orders ON reviews.orderId = orders.id WHERE toUserId = ?`, [userId]);
        } catch (e) {
            throw e;
        }

        try {
            var needReviews = await pool.query(`SELECT users.name AS userName, users.id AS user_id, orders.id AS order_id, orders.*, DATE_FORMAT(orders.completeDate, '%k:%i, %d %M %Y') AS dateComplete FROM orders LEFT JOIN users ON (orders.userId = users.id OR orders.contractorId = users.id) AND users.id != ? WHERE orders.completeDate AND ((orders.userId = ? AND orders.reviewUser IS NULL) OR (orders.contractorId = ? AND orders.reviewContractor IS NULL))`, [userId, userId, userId]);
        } catch (e) {
            throw e;
        }

        return {myReviews: myReviews, reviewsForMe: reviewsForMe, needReviews: needReviews}
    }

    async postReview(obj){
        console.log('post review');
        try {
            var res = await pool.query(`INSERT INTO reviews (orderId, toUserId, fromUserId, text, rating, datePost) VALUES (?, ?, ?, ?, ?, NOW())`, [obj.orderId, obj.toUserId, obj.fromUserId, obj.text, obj.raiting]);
        } catch (e) {
            throw e;
        }

        if (res.insertId > 0){
            console.log('get order');
            try {
                var orders = await pool.query(`SELECT * FROM orders WHERE id = ?`, [obj.orderId]);
            } catch (e) {
                throw e;
            }
            var order = orders[0];
            console.log(order);
            if (order.userId === obj.fromUserId) {
                console.log('user review');
                try {
                    var user = await pool.query('UPDATE orders SET reviewUser = ? WHERE id = ?', [res.insertId, obj.orderId]);
                }  catch (e) {
                    throw e
                }
            } else if (order.contractorId === obj.fromUserId) {
                console.log('contractor review');
                try {
                    var user = await pool.query('UPDATE orders SET reviewContractor = ? WHERE id = ?', [res.insertId, obj.orderId]);
                }  catch (e) {
                    throw e
                }
            }
            return 'ok'
        } else {
            return new Error('Cannot insert review');
        }
    }

    async editTextOnReview (obj){
        try {
            var user = await pool.query('UPDATE reviews SET text = ? WHERE id = ?', [obj.text, obj.reviewId]);
        }  catch (e) {
            throw e
        }

        return 'ok'
    }

    async editRatingOnReview (obj){
        try {
            var user = await pool.query('UPDATE reviews SET rating = ? WHERE id = ?', [obj.rating, obj.reviewId]);
        }  catch (e) {
            throw e
        }

        return 'ok'
    }

    async deleteReview (id){
        try {
            var res = await pool.query('DELETE FROM reviews WHERE id = ?', [id])
        }  catch (e) {
            throw e
        }

        try {
            var res = await pool.query('UPDATE orders SET reviewUser = NULL WHERE reviewUser = ?', [id])
        }  catch (e) {
            throw e
        }

        try {
            var res = await pool.query('UPDATE orders SET reviewContractor = NULL WHERE reviewContractor = ?', [id])
        }  catch (e) {
            throw e
        }

        return 'ok';
    }
}

module.exports = new ReviewsModel();