var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
let emailModel = require('./EmailModel');
let geoModel = require('./GeoModel');
let CONSTANTS = require('../CONSTANTS');
var Big = require('big.js');

class AuthModel {
    constructor() {

    }

    async registerUser (obj) {

        if (!obj.email || !obj.userName || !obj.password || (obj.isCustomers !== 1 && obj.isCustomers !== 0)){
            throw new Error('Not enough data!');
        }

        if (obj.password !== obj.repeatPass){
            throw new Error('Passwords do not match!');
        }

        if (obj.password.length < 6){
            throw new Error('Passwords is too short');
        }

        if (obj.isCustomers === 0 && !obj.regWithoutAddress){
            if (!obj.countryCode || !obj.countryName || !obj.city || obj.countryCode.length === 0 || obj.countryName.length === 0 || obj.city.length === 0){
                throw new Error('city or country is null');
            }
            var country = await geoModel.getCountryObj(obj.countryCode, obj.countryName);
            var city = await geoModel.getCityObj(obj.city, country.id);
        }

        try {
            var result = await pool.query(`SELECT * FROM users WHERE email = ?`, [obj.email]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            throw new Error('This email has already been registered.');
        }

        try {
            var result = await pool.query(`SELECT * FROM users WHERE name = ?`, [obj.userName]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            throw new Error('This name has already been registered.');
        }

        try {
            var result = await pool.query(`INSERT INTO users (name, email, password, isCustomer, date_register, address, lat, longg, aboutMe, countryId, cityId, regRefId, lastOnline) VALUES(?, ?, ?, ?, NOW(), ?, ?, ?, '', ?, ?, ?, NOW())`,
                [obj.userName, obj.email, obj.password, obj.isCustomers, obj.address, obj.lat, obj.long, obj.isCustomers === 0 && !obj.regWithoutAddress ? country.id : null, obj.isCustomers === 0 && !obj.regWithoutAddress ? city.id : null, obj.refId]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0){
            var email = await emailModel.registration(obj.email, obj.userName, obj.password);

            try {
                var result2 = await pool.query(`SELECT * FROM users WHERE id = ?`, [result.insertId]);
            } catch (e) {
                throw e;
            }

            if (result2.length > 0){
                return result2[0];
            } else {
                throw new Error('Cannot find user');
            }
        }

        return result.insertId;
    }

    async loginUser (obj) {
        console.log(obj);
        try {
            var result = await pool.query(`SELECT users.*, SUM(CASE WHEN comments.userId = users.id then 1 ELSE 0 END) AS commentsCount FROM users LEFT JOIN comments ON comments.userId = users.id WHERE name = ? AND password = ? GROUP BY users.id`, [obj.userName, obj.password]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            var id = result[0].id;
            var userObj = result[0];

            if (userObj.isCustomer === 1){
                try {
                    var orders = await pool.query(`SELECT *, DATEDIFF(NOW(), orders.completeDate) AS datedifff FROM orders WHERE userId = ?`, [id]);
                } catch (e) {
                    throw e;
                }
                userObj.ordersCount = orders.length;
                //userObj.userOrders = orders;
                userObj.spentToday = 0;
                userObj.spentYesterday = 0;
                userObj.spentWeek = 0;
                userObj.spentLastWeek = 0;
                userObj.spentAllTime = 0;
                // how much spent for today, week and all time
                if (orders.length > 0){
                    orders.forEach(order => {
                        if (order.datedifff){
                            console.log(order.datediff);
                            if (order.datedifff < 1){
                                userObj.spentToday = new Big(userObj.spentToday).plus(order.shippingFee).plus(order.coastOfGoods).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff >= 1 && order.datediff < 2){
                                userObj.spentYesterday = new Big(userObj.spentYesterday).plus(order.shippingFee).plus(order.coastOfGoods).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff <= 7){
                                userObj.spentWeek = new Big(userObj.spentWeek).plus(order.shippingFee).plus(order.coastOfGoods).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datediff <= 14 && order.datediff > 7){
                                userObj.spentLastWeek = new Big(userObj.spentLastWeek).plus(order.shippingFee).plus(order.coastOfGoods).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            userObj.spentAllTime = new Big(userObj.spentAllTime).plus(order.shippingFee).plus(order.coastOfGoods).toFixed(2).toString();
                        }
                    });

                    if (userObj.spentLastWeek > 0 && userObj.earnedWeek > 0){
                        userObj.percentWeek = new Big(userObj.spentLastWeek).minus(userObj.spentWeek).div(userObj.spentLastWeek).times(100).toFixed(2).toString();
                    } else {
                        userObj.percentWeek = userObj.spentWeek > userObj.spentLastWeek ? 100 : 0;
                    }

                    if (userObj.spentYesterday > 0 && userObj.spentToday > 0){
                        userObj.percentYesterday = new Big(userObj.spentYesterday).minus(userObj.spentToday).div(userObj.spentYesterday).times(100).toFixed(2).toString();
                    } else {
                        userObj.percentYesterday = userObj.spentToday > userObj.spentYesterday ? 100 : 0;
                    }
                }
                userObj.answersCount = 0;
                userObj.answersLastMonth = 0;
            }
            else {
                try {
                    var orders = await pool.query(`SELECT *, DATEDIFF(NOW(), orders.completeDate) AS datedifff FROM orders WHERE contractorId = ?`, [id]);
                } catch (e) {
                    throw e;
                }

                userObj.ordersCount = orders.length;
                //userObj.userOrders = orders;
                userObj.earnedToday = 0;
                userObj.spentYesterday = 0;
                userObj.earnedWeek = 0;
                userObj.earnedLastWeek = 0;
                userObj.earnedAllTime = 0;
                userObj.ordersLastMonth = 0;
                // how much earned for today, week and all time
                if (orders.length > 0){
                    orders.forEach(order => {
                        if (order.datedifff){
                            console.log(order.datedifff);
                            if (order.datedifff < 1){
                                userObj.earnedToday =  new Big(userObj.earnedToday).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff >= 1 && order.datediff < 2){
                                userObj.earnedYesterday =  new Big(userObj.earnedYesterday).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff <= 7){
                                userObj.earnedWeek = new Big(userObj.earnedWeek).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff <= 14 && order.datedifff > 7){
                                userObj.earnedLastWeek =  new Big(userObj.earnedLastWeek).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                            }
                            if (order.datedifff <= 30){
                                userObj.ordersLastMonth++;
                            }
                            userObj.earnedAllTime = new Big(userObj.earnedAllTime).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                        }
                    });
                    if (userObj.earnedLastWeek > 0 && userObj.earnedWeek > 0){
                        userObj.percentWeek = new Big(userObj.earnedLastWeek).minus(userObj.earnedWeek).div(userObj.earnedLastWeek).times(-100).toFixed(2).toString();
                    } else {
                        userObj.percentWeek = userObj.earnedWeek > userObj.earnedLastWeek ? 100 : 0;
                    }

                    if (userObj.earnedYesterday > 0 && userObj.earnedToday > 0){
                        userObj.percentYesterday = new Big(userObj.earnedYesterday).minus(userObj.earnedToday).div(userObj.earnedYesterday).times(-100).toFixed(2).toString();
                    } else {
                        userObj.percentYesterday = userObj.earnedToday > userObj.earnedYesterday ? 100 : 0;
                    }
                }

                try {
                    var answers = await pool.query(`SELECT * FROM answers WHERE userId = ?`, [id]);
                } catch (e) {
                    throw e;
                }

                try {
                    var answersLastMonth = await pool.query(`SELECT * FROM answers WHERE DATEDIFF(NOW(), datePost) < 31 AND userId = ?`, [id]);
                } catch (e) {
                    throw e;
                }

                userObj.answersCount = answers.length;
                userObj.answersLastMonth = answersLastMonth.length;
            }

            try {
                var commentsLastMonth = await pool.query(`SELECT * FROM comments WHERE DATEDIFF(NOW(), datePost) < 31 AND userId = ?`, [id]);
            } catch (e) {
                throw e;
            }

            userObj.commentsLastMonth = commentsLastMonth.length;

            return userObj;
        } else {
            throw new Error('Cannot find user');
        }
    }

    async forgotPass (obj){
        console.log('forgotPass');
        if (!obj.email || !obj.userName) {
            throw Error('validation error in restore password module');
        }

        if (obj.email.length < 5 || obj.email.includes("@") === false || obj.email.includes(".") === false) {
            console.log('email', email);
            throw new Error('Invalid email')
        }

        if (obj.userName.length < 5) {
            console.log('userName', email);
            throw new Error('Invalid username')
        }

        var token = crypto.randomBytes(36).toString('hex');
        try {
            let result = await pool.query('UPDATE `users` SET `restorePasswordHash`=? WHERE email=? AND name=?', [token, obj.email, obj.userName]);
            if (result.affectedRows === 0) {
                throw new Error('User with this email and name not found.');
            }
        } catch (err) {
            throw err;
        }
        console.log(token);

        let email = await emailModel.forgotPassword(obj.email, obj.userName, token);

        return 'success';
    }

    async resetPass (obj){
        if (!obj.token || obj.token.length === 0 || typeof obj.token !== 'string' ||
            !obj.password || typeof obj.password !== 'string' ||
            !obj.repeatPass || typeof obj.repeatPass !== 'string') {
            throw Error('validation error in restore password module')
        }
        if (obj.password !== obj.repeatPass) {
            throw Error('Passwords do not match');
        }
        if (obj.password.length <= 5 || obj.repeatPass.length <= 5) {
            throw Error ('Password very short (min length is 6)');
        }
        try {
            let user = await pool.query('SELECT * FROM `users` WHERE `restorePasswordHash`=?',[obj.token]);
            let updated = await pool.query(
                'UPDATE `users` SET `restorePasswordHash`=null, `password`=? WHERE `restorePasswordHash`=?',
                [obj.password, obj.token]
            );
            if (updated.affectedRows === 0) {
                throw new Error('BadRestoreToken');
            }
            else {
                if(user[0]) {
                    let email = await emailModel.resetPassword(user[0].email, user[0].name, obj.password);
                }
            }
        } catch (err) {
            throw err;
        }

        return 'success';
    }

    async getProfileById (id) {
        console.log('get profile by id ' + id);
        try {
            var result = await pool.query(`SELECT users.name, users.backgroudProfilePath, users.avatarPath, users.isCustomer, users.address, DATE_FORMAT(users.lastOnline, '%k:%i, %d %M %Y') AS online FROM users WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0){
            try {
                var reviewsForMe = await pool.query(`SELECT reviews.*, users.name, users.avatarPath, users.id AS user_id, orders.title, orders.slug, DATE_FORMAT(orders.completeDate, '%k:%i, %d %M %Y') AS dateComplete, DATE_FORMAT(reviews.datePost, '%k:%i, %d %M %Y') AS dateReview FROM reviews LEFT JOIN users ON reviews.fromUserId = users.id LEFT JOIN orders ON reviews.orderId = orders.id WHERE toUserId = ?`, [id]);
            } catch (e) {
                throw e;
            }

            result[0].likes = 0;
            result[0].dislikes = 0;

            for (var i = 0; i < reviewsForMe.length; i++){
                if (reviewsForMe[i].rating === 1){
                    result[0].likes++;
                } else {
                    result[0].dislikes++;
                }
            }

            result[0].reviews = reviewsForMe;

            try {
                var orders = await pool.query(`SELECT * FROM orders WHERE userId = ? OR contractorId = ?`, [id, id]);
            } catch (e) {
                throw e;
            }

            result[0].ordersCount = orders.length;

            try {
                var answers = await pool.query(`SELECT * FROM answers WHERE userId = ?`, [id]);
            } catch (e) {
                throw e;
            }

            result[0].answersCount = answers.length;

            try {
                var comments = await pool.query(`SELECT * FROM comments WHERE userId = ?`, [id]);
            } catch (e) {
                throw e;
            }

            result[0].commentsCount = comments.length;

            return result[0];
        } else {
            throw new Error('Cannot find user');
        }
    }

    async saveProfileChanges (obj) {
        if (obj.name.length < 4){
            throw new Error('Your new name is very short!')
        }
        if (obj.email.length < 4 || !obj.email.includes('@') || !obj.email.includes('.')){
            throw new Error('Your new email is incorrect!')
        }

        try {
            var result = await pool.query(`UPDATE users SET name = ?, email = ?, paymentType = ?, paymentInfo = ?, apartments = ? WHERE id = ?`,
                [obj.name, obj.email, obj.paymentType, obj.paymentInfo, obj.apartments, obj.userId]);
        } catch (e) {
            throw e;
        }

        if (result.affectedRows > 0){
            return 'ok'
        } else {
            throw Error('I cannot update information.')
        }
    }

    async changePassword (obj) {
        if (obj.newPassword.length < 6){
            throw new Error('Your new password is very short!')
        }
        if (obj.oldPassword === obj.newPassword){
            throw new Error('Your old and new passwords match')
        }
        if (obj.newPassword !== obj.repeatPassword){
            throw new Error('Your new password and repeat password do not match')
        }

        try {
            var user = await pool.query(`SELECT * FROM users WHERE password = ? AND id = ?`, [obj.oldPassword, obj.userId]);
        } catch (e) {
            throw e;
        }

        if (user.length > 0){
            try {
                var result = await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [obj.newPassword, obj.userId]);
            } catch (e) {
                throw e;
            }

            if (result.affectedRows > 0){
                return 'ok'
            } else {
                throw Error('I cannot update information.')
            }
        } else {
            throw Error('Your old password is wrong')
        }

    }

    async changeBackground (obj) {
        try {
            var fileName = path.join(__dirname, `../public/img/backgroundsProfile/${obj.id}.${obj.file.type}`);

            const folders = fileName.split(path.sep).slice(0, -1);
            if (folders.length) {
                // create folder path if it doesn't exist
                folders.reduce((last, folder) => {
                    const folderPath = last ? last + path.sep + folder : folder;
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath)
                    }
                    return folderPath
                })
            }

            await fs.writeFileSync(fileName, obj.file.FILE,);
        } catch (e) {
            throw e
        }

        try {
            var res = await pool.query('UPDATE users SET backgroudProfilePath = ? WHERE id = ?', [`${obj.id}.${obj.file.type}`, obj.id])
        }  catch (e) {
            throw e
        }

        if (res.affectedRows > 0){
            return 'ok'
        } else {
            throw new Error('Cannot insert in db')
        }
    }

    async changeAvatar (obj) {
        try {
            var fileName = path.join(__dirname, `../public/img/users/${obj.id}.${obj.file.type}`);

            const folders = fileName.split(path.sep).slice(0, -1);
            if (folders.length) {
                // create folder path if it doesn't exist
                folders.reduce((last, folder) => {
                    const folderPath = last ? last + path.sep + folder : folder;
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath)
                    }
                    return folderPath
                })
            }

            await fs.writeFileSync(fileName, obj.file.FILE,);
        } catch (e) {
            throw e
        }

        try {
            var res = await pool.query('UPDATE users SET avatarPath = ? WHERE id = ?', [`${obj.id}.${obj.file.type}`, obj.id])
        }  catch (e) {
            throw e
        }

        if (res.affectedRows > 0){
            return 'ok'
        } else {
            throw new Error('Cannot insert in db')
        }

    }

    async deleteAccount (id) {
        console.log('delete account');
        try {
            var res = await pool.query('DELETE FROM users WHERE id = ?', [id])
        }  catch (e) {
            throw e
        }

        return 'ok';
    }

    async saveRefId (userId, refId){
        try {
            var ref = await pool.query('SELECT myRefId FROM users WHERE myRefId = ?', [refId]);
        }  catch (e) {
            throw e
        }

        if (ref.length === 0){
            try {
                var res = await pool.query('UPDATE users SET myRefId = ? WHERE id = ?', [refId, userId]);
            }  catch (e) {
                throw e
            }

            return 'ok';
        } else {
            throw new Error('Ref id find. Try again.');
        }

    }

    async getUsersRegMyRefId (id){
        try {
            var res = await pool.query('SELECT *, DATE_FORMAT(date_register, \'%k:%i, %d %M %Y\') as dateFormat FROM users WHERE regRefId = ? && isCustomer = 0', [id]);
        }  catch (e) {
            throw e
        }

        for (var i = 0; i < res.length; i++) {
            try {
                var orders = await pool.query(`SELECT orders.*, commissions.*, DATEDIFF(NOW(), commissions.dateAlreadyPaid) AS datedifff FROM commissions LEFT JOIN orders ON orders.id = commissions.orderId WHERE commissions.userId = ? && commissions.dateAlreadyPaid`, [res[i].id]);
            } catch (e) {
                throw e;
            }

            res[i].ordersCount = orders.length;
            res[i].earnedAllTime = 0;
            res[i].comissions = 0;
            res[i].needPaid = 0;
            if (orders.length > 0){
                orders.forEach(order => {
                    res[i].earnedAllTime = new Big(res[i].earnedAllTime).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                    res[i].comissions = new Big(res[i].comissions).plus(order.commissionCount);
                    res[i].needPaid =   new Big(res[i].needPaid).plus(new Big(order.commissionCount).times(0.25)).toFixed(2).toString();
                });
            }
        }

        return res;
    }

    async getUsersWithRegRefId () {
        try {
            var res = await pool.query('SELECT users.*, DATE_FORMAT(date_register, \'%k:%i, %d %M %Y\') as dateFormat FROM users WHERE myRefId');
        }  catch (e) {
            throw e
        }

        for(var i = 0; i < res.length; i++) {
            try {
                var reff = await pool.query('SELECT * FROM users WHERE regRefId = ?', [res[i].myRefId]);
            } catch (e) {
                throw e
            }

            res[i].ordersCount = 0;
            res[i].earnedAllTime = 0;
            res[i].comissions = 0;
            res[i].needPaid = 0;
            var date = '';
            var datediff = 999;

            for (var j = 0; j < reff.length; j++) {
                try {
                    var orders = await pool.query(`SELECT orders.*, commissions.*, DATEDIFF(NOW(), commissions.dateAlreadyPaid) AS datedifff, DATE_FORMAT(commissions.dateAlreadyPaid, '%k:%i, %d %M %Y') as dateFormat FROM commissions LEFT JOIN orders ON orders.id = commissions.orderId WHERE commissions.userId = ? && commissions.dateAlreadyPaid`, [reff[j].id]);
                } catch (e) {
                    throw e;
                }

                res[i].ordersCount += orders.length;
                if (orders.length > 0) {
                    orders.forEach(order => {
                        res[i].earnedAllTime = new Big(res[i].earnedAllTime).plus(order.shippingFee).toFixed(2).toString(); // in BIGDECIMAL
                        res[i].comissions = new Big(res[i].comissions).plus(order.commissionCount);
                        res[i].needPaid =   new Big(res[i].needPaid).plus(new Big(order.commissionCount).times(0.25)).toFixed(2).toString();
                        if (order.datedifff && order.datedifff < datediff) {
                            datediff = order.datedifff;
                            date = order.dateFormat;
                        }
                    });
                }
            }
            res[i].dateNotPaid = date;
        }

        console.log(JSON.stringify(res));
        return res;
    }

    async paidToUser (obj){
        try {
            var user = await pool.query('SELECT users.* FROM users WHERE id = ?', [obj.userId]);
        }  catch (e) {
            throw e
        }

        try {
            var res = await pool.query('UPDATE users SET historicalPaid = ? WHERE id = ?', [new Big(user[0].historicalPaid ? user[0].historicalPaid : 0).plus(obj.needPaid).toFixed(2).toString(), obj.userId]);
        }  catch (e) {
            throw e
        }

        var email = await emailModel.paidForYourRefers(user.email, user.name, user.paymentType, user.paymentInfo);

        return 'ok'
    }

    async disconnectUser (userId) {
        try {
            var user = await pool.query('UPDATE users SET lastOnline = NOW() WHERE id = ?', [userId]);
        }  catch (e) {
            throw e
        }

        try {
            var user = await pool.query('SELECT DATE_FORMAT(lastOnline, \'%k:%i, %d %M %Y\') AS online FROM users WHERE id = ?', [userId]);
        }  catch (e) {
            throw e
        }

        return user[0].online;
    }

    async getLatOnline (id){
        try {
            var user = await pool.query('SELECT DATE_FORMAT(lastOnline, \'%k:%i, %d %M %Y\') AS online FROM users WHERE id = ?', [userId]);
        }  catch (e) {
            throw e
        }

        return user[0].online;
    }

    async changeAddressUser (obj) {
        if (!obj.countryCode || !obj.countryName || !obj.city || obj.countryCode.length === 0 || obj.countryName.length === 0 || obj.city.length === 0){
            console.log(obj);
            throw new Error('city or country is null');
        }

        var country = await geoModel.getCountryObj(obj.countryCode, obj.countryName);
        var city = await geoModel.getCityObj(obj.city, country.id);

        try {
            var result = await pool.query(`UPDATE users SET lat = ?, longg = ?, address = ?, countryId = ?, cityId = ?, apartments = ? WHERE id = ?`,
                [obj.lat, obj.long, obj.address, country.id, city.id, obj.apartments, obj.userId]);
        } catch (e) {
            throw e;
        }

        return {countryId: country.id, cityId: city.id}
    }
}

module.exports = new AuthModel();