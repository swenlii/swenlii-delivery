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

class OrdersModel {
    constructor() {

    }

    async postOrder (obj) {
        console.log('post order');
        if (!obj.countryId && !obj.cityId){
            if (!obj.countryCode || !obj.countryName || !obj.city || obj.countryCode.length === 0 || obj.countryName.length === 0 || obj.city.length === 0){
                console.log(obj);
                throw new Error('city or country is null');
            }

            var country = await geoModel.getCountryObj(obj.countryCode, obj.countryName);
            var city = await geoModel.getCityObj(obj.city, country.id);
        }

        if (obj.title.length === 0 || obj.description.length === 0 || obj.payment.length === 0){
            throw new Error ('Not all fields are filled');
        }

        if (obj.shippingFee.length === 0 || isNaN(obj.shippingFee)){
            throw new Error ('You have not entered the amount of payment for delivery or it is not a number')
        }

        if (obj.coastOfGoods.length === 0 || isNaN(obj.coastOfGoods)){
            throw new Error ('You have not entered the amount of the approximate price of the goods or this is not a number')
        }

        console.log(obj);

        var slug = slugify(obj.title, {
            lower: true,
            remove: /[*=+~.,()'"!?:;$%&@^`#№]/g,
            strict: true
        });

        try {
            var slugs = await pool.query(`SELECT * FROM orders WHERE slug = ?`,
                [slug]);
        } catch (e) {
            throw e;
        }

        if (slugs.length > 0){
            slug = slug + '-' + (slugs.length + 1);
        }



        try {
            var user = await pool.query(`SELECT users.* FROM users WHERE id = ?`, [obj.userId]);
        } catch (e) {
            throw e;
        }

        if (!user[0].lat && !user[0].longg){
            try {
                var result = await pool.query(`UPDATE users SET lat = ?, longg = ?, address = ?, countryId = ?, cityId = ?, apartments =? WHERE id = ?`, [obj.lat, obj.long, obj.address, country.id, city.id, obj.apartaments, obj.userId]);
            } catch (e) {
                throw e;
            }
        }

        if (!user[0].phone){
            try {
                var result = await pool.query(`UPDATE users SET phone = ? WHERE id = ?`, [obj.phoneNumber, obj.userId]);
            } catch (e) {
                throw e;
            }
        }

        try {
            var result = await pool.query(`INSERT INTO orders (title, description, userId, payment, address, lat, longg, slug, shippingFee, coastOfGoods, countryId, cityId, date, phoneNumber, currency, apartaments) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
                [obj.title, obj.description, obj.userId, obj.payment, obj.address, obj.lat, obj.long, slug, obj.shippingFee, obj.coastOfGoods, obj.countryId ? obj.countryId : country.id, obj.cityId ? obj.cityId : city.id, obj.phoneNumber, obj.currency, obj.apartaments]);
        } catch (e) {
            throw e;
        }

        console.log('after insert');

        if (result.insertId > 0){
            // провека всех доставщиков, достаем пользователей, с isCustomer = 0 и  находящихся не дальше 15 км. И отсылаем каждому письмо.
            try {
                var deliverymans = await pool.query(`SELECT
                                            *,
                                            ACOS( SIN( RADIANS( \`lat\` ) ) * SIN( RADIANS( ? ) ) + COS( RADIANS( \`lat\` ) )
                                            * COS( RADIANS( ? )) * COS( RADIANS( \`longg\` ) - RADIANS( ? )) ) * 6372.8 AS \`distance\`
                                            FROM users
                                            WHERE ACOS( SIN( RADIANS( \`lat\` ) ) * SIN( RADIANS( ? ) ) + COS( RADIANS( \`lat\` ) )
                                            * COS( RADIANS( ? )) * COS( RADIANS( \`longg\` ) - RADIANS( ? )) ) * 6372.8 < 15 AND users.isCustomer = 0
                                            ORDER BY \`distance\``,
                    [obj.lat, obj.lat, obj.long, obj.lat, obj.lat, obj.long]);
            } catch (e) {
                throw e;
            }
            console.log('get deliverymans');
            if (deliverymans.length > 0){
                obj.id = result.insertId;
                emailModel.sendEmailToDeliverymans(deliverymans, obj);
            }
            return result.insertId;
        } else {
            throw new Error('cannot insert order');
        }
    }

    async getAllOrders () {
        try {
            var result = await pool.query(`SELECT orders.*, commissions.commissionCount, commissions.alreadyPaid, commissions.transactionId, commissions.satatus, commissions.dateAlreadyPaid, users.name, users.avatarPath, users.id AS user_id, DATE_FORMAT(orders.date, '%k:%i, %d %M %Y') as datePost, DATE_FORMAT(users.lastOnline, '%k:%i, %d %M %Y') AS online FROM orders LEFT JOIN users ON users.id = orders.userId LEFT JOIN commissions ON commissions.orderId = orders.id ORDER BY orders.date DESC`);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            for (var i = 0; i < result.length; i++){
                try {
                    var review = await pool.query(`SELECT reviews.* FROM reviews WHERE fromUserId = ? && orderId = ?`, [result[i].user_id, result[i].id]);
                } catch (e) {
                    throw e;
                }

                if (review.length > 0){
                    result[i].review = review[0];
                }

                try {
                    var likes = await pool.query(`SELECT SUM(CASE WHEN rating = 1 then 1 ELSE 0 END) AS likeCount, SUM(CASE WHEN rating = -1 then 1 ELSE 0 END) AS dislikeCount FROM reviews WHERE toUserId = ?`, [result[i].user_id]);
                } catch (e) {
                    throw e;
                }

                result[i].likes = likes[0].likeCount;
                result[i].dislikes = likes[0].dislikeCount;

                try {
                    var answers = await pool.query(`SELECT answers.*, users.name, users.avatarPath, DATE_FORMAT(answers.datePost, '%k:%i, %d %M %Y') as dateFormat, DATE_FORMAT(users.lastOnline, '%k:%i, %d %M %Y') AS online FROM answers LEFT JOIN users ON users.id = answers.userId WHERE orderId = ? ORDER BY answers.datePost DESC`, [result[i].id]);
                } catch (e) {
                    throw e;
                }

                if (answers.length > 0){
                    for (var j = 0; j < answers.length; j++){
                        try {
                            var comments = await pool.query(`SELECT comments.*, users.name, users.avatarPath, DATE_FORMAT(comments.datePost, '%k:%i, %d %M %Y') as dateFormat, DATE_FORMAT(users.lastOnline, '%k:%i, %d %M %Y') AS online FROM comments LEFT JOIN users ON users.id = comments.userId WHERE answerId = ? ORDER BY comments.datePost ASC`, [answers[j].id]);
                        } catch (e) {
                            throw e;
                        }
                        answers[j].comments = comments;
                    }
                }

                result[i].answers = answers;
            }
        }

        return result;
    }

    async getOrdersInRadius (lat, long) {
        try {
            var result = await pool.query(`SELECT
                                            *,
                                            ACOS( SIN( RADIANS( \`lat\` ) ) * SIN( RADIANS( ? ) ) + COS( RADIANS( \`lat\` ) )
                                            * COS( RADIANS( ? )) * COS( RADIANS( \`longg\` ) - RADIANS( ? )) ) * 6372.8 AS \`distance\`
                                            FROM orders
                                            WHERE ACOS( SIN( RADIANS( \`lat\` ) ) * SIN( RADIANS( ? ) ) + COS( RADIANS( \`lat\` ) )
                                            * COS( RADIANS( ? )) * COS( RADIANS( \`longg\` ) - RADIANS( ? )) ) * 6372.8 < 15
                                            ORDER BY \`distance\``,
                [lat, lat, long, lat, lat, long]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            for (var i = 0; i < result.length; i++){
                try {
                    var answers = await pool.query(`SELECT answers.*, users.name, users.avatarPath, DATE_FORMAT(answers.datePost, '%k:%i, %d %M %Y') as dateFormat FROM answers LEFT JOIN users ON users.id = answers.userId WHERE orderId = ? ORDER BY answers.datePost DESC`, [result[i].id]);
                } catch (e) {
                    throw e;
                }

                if (answers.length > 0){
                    for (var j = 0; j < answers.length; j++){
                        try {
                            var comments = await pool.query(`SELECT comments.*, users.name, users.avatarPath, DATE_FORMAT(comments.datePost, '%k:%i, %d %M %Y') as dateFormat FROM comments LEFT JOIN users ON users.id = comments.userId WHERE answerId = ? ORDER BY comments.datePost ASC`, [answers[j].id]);
                        } catch (e) {
                            throw e;
                        }
                        answers[j].comments = comments;
                    }
                }

                result[i].answers = answers;
            }
        }

        return result;
    }

    async postAnswer (obj) {
        try {
            var result = await pool.query(`INSERT INTO answers (orderId, userId, answerText, datePost) VALUES(?, ?, ?, NOW())`, [obj.orderId, obj.userId, obj.text]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0){
            try {
                var answer = await pool.query(`SELECT answers.*, users.name, users.avatarPath, DATE_FORMAT(answers.datePost, '%k:%i, %d %M %Y') as dateFormat FROM answers LEFT JOIN users ON users.id = answers.userId WHERE answers.id = ?`, [result.insertId]);
            } catch (e) {
                throw e;
            }

            return answer[0]
        } else {
            throw new Error('Cannot find answer');
        }
    }

    async postComment (obj) {
        console.log(obj);
        try {
            var result = await pool.query(`INSERT INTO comments (answerId, userId, commentText, datePost) VALUES(?, ?, ?, NOW())`, [obj.answerId, obj.userId, obj.text]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0){
            try {
                var comment = await pool.query(`SELECT comments.*, users.name, users.avatarPath, DATE_FORMAT(comments.datePost, '%k:%i, %d %M %Y') as dateFormat FROM comments LEFT JOIN users ON users.id = comments.userId WHERE comments.id = ?`, [result.insertId]);
            } catch (e) {
                throw e;
            }

            return comment[0];
        } else {
            throw new Error('Cannot find comment');
        }
    }

    async selectContractor (obj) {
        console.log(obj);
        try {
            var result = await pool.query(`UPDATE orders SET contractorId = ?  WHERE id = ?`, [obj.userId, obj.orderId]);
        } catch (e) {
            throw e;
        }

        try {
            var contractor = await pool.query(`SELECT * FROM users WHERE id = ?`, [obj.userId]);
        } catch (e) {
            throw e;
        }


        try {
            var customer = await pool.query(`SELECT * FROM users WHERE id = ?`, [obj.myId]);
        } catch (e) {
            throw e;
        }

        var email1 = await emailModel.youSelectedInOrder(contractor[0].email, contractor[0].name, customer[0].name, obj.orderId);
        var email1 = await emailModel.youSelectedInOrder(customer[0].email, customer[0].name, contractor[0].name, obj.orderId);

        return result.insertId;
    }

    async likeClick (obj){
        try {
            var likeCount = await pool.query(`SELECT * FROM answers WHERE id = ?`, [obj.answerId]);
        } catch (e) {
            throw e;
        }

        if (!likeCount[0].likeCount.includes(obj.myId)){
            try {
                var result = await pool.query(`UPDATE answers SET likeCount = ?  WHERE id = ?`, [likeCount[0].likeCount ? likeCount[0].likeCount + '/' + obj.myId: obj.myId, obj.answerId]);
            } catch (e) {
                throw e;
            }
        }

        return 'ok'
    }

    async closeOrder (id){
        try {
            var likeCount = await pool.query(`UPDATE orders SET closeOrder = 1 WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }
    }

    async performedOrder (id){
        try {
            var order = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }

        var comiss = new Big(order[0].shippingFee).times(new Big('0.03')).toFixed(2).toString();

        try {
            var commission = await pool.query(`INSERT INTO commissions (userId, orderId, commissionCount) VALUES (?, ?, ?)`, [order[0].contractorId, id, comiss]);
        } catch (e) {
            throw e;
        }

        if (commission.insertId > 0){
            try {
                var likeCount = await pool.query(`UPDATE orders SET completedOrder = 1, completeDate = NOW() WHERE id = ?`, [id]);
            } catch (e) {
                throw e;
            }

            return 'ok'
        } else {
            throw Error('cannot insert comissions');
        }


    }
}

module.exports = new OrdersModel();