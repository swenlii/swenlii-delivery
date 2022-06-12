var mysql = require('mysql');
var pool = require('./DBConnectionModel').returnPoolConnection();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let CONSTANTS = require('../CONSTANTS');

class EmailModel {
    constructor() {
    }

    sendEmailToUser(emailObj) {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'Yandex',
                auth: {
                    user: CONSTANTS.sendEmailUser,
                    pass: CONSTANTS.sendEmailPassword
                }
            });

            transporter.sendMail({
                from: 'test_service@localcrypto.cloud',
                to: emailObj.email,
                subject: emailObj.subject,
                html: emailObj.htmlText
            }, (error, infoSuccess) => {
                if (error) {
                    console.log("error in sending email: ", error);
                    return reject(error);
                } else {
                    console.log("success in sending email: ", infoSuccess);
                    return resolve(infoSuccess);
                }
            });
        })
    }

    sendEmailToDeliverymans(deliverymans, order) {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'Yandex',
                auth: {
                    user: CONSTANTS.sendEmailUser,
                    pass: CONSTANTS.sendEmailPassword
                }
            });

            if (deliverymans.length > 0){
                for (var i = 0; i < deliverymans.length; i ++){
                    if (deliverymans[i]){
                        try {
                            transporter.sendMail({
                                from: 'test_service@localcrypto.cloud',
                                to: deliverymans[i].email,
                                subject: 'There is a new order for you!',
                                html:  `<p>Good afternoon, ${deliverymans[i].name}!</p> <br> 
                                    <p>Just someone posted a new order, which is not far from you:</p><br>
                                    <b>Title:</b> ${order.title} <br>
                                    <b>Address:</b> ${order.address} <br>
                                    <p>If you are interested in the order, you can familiarize yourself with it at the link below:</p><br>
                                    https://swenlii-delivery.ru/#orderPage/${order.id}`
                            }, (error, infoSuccess) => {
                                if (error) {
                                    console.log("error in sending email: ", error);
                                } else {
                                    console.log("success in sending email: ", infoSuccess);
                                }
                            });
                        } catch (e) {
                            if (e.message.toString().includes('No recipients defined')){ // email is not valid
                                return;
                            } else {
                                throw e
                            }
                        }
                    }
                }
            }

        })
    }

    async registration(email, username, password) {
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "Thanks for registration on Swenli's Delivery!";
        emailObj.htmlText =
            `<p>Good day, ${username}!<br />
            Thanks for registration on Swenli's Delivery!</p><br>
            Save the new details for access to your personal account:</p><p>Login: <b>` +
            username + "</b><br/> Password: <b>" + password +
            '<br /></p><p>Swenli\'s Delivery</p>';

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }

        return result;
    }

    async forgotPassword(email, username, token) {
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "Password Reset";
        var link = 'http://swenlii-delivery.ru/reset-password/reset_token=' + token;
        console.log(link);
        emailObj.htmlText =
            `<p>Good day, ${username}!<br />
            Someone recently requested password recovery for your account on Swenli's Delivery</p>
            <p>To reset your password click this:<br> 
            <a href="${link}">${link}</a>
            <br />
            <p>Swenli's Delivery</p>`;

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async resetPassword(email, username, password) {
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "Password Reset Successfully";
        emailObj.htmlText = '<p>Good day! <br />Save the new details for access to your personal account:</p>Login: <b>' +
            username + "</b><br/> Password: <b>" + password +
            '<br /><p>swenlii-delivery.ru</p>';

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async youSelectedInOrder(email, username, customer, orderId) {
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "You are selected for order execution";
        emailObj.htmlText =
            `<p>Good day, ${username}!<br />
            User ${customer} has chosen you as the executor of his order. You can begin to execute it. Details about the order:</p><br>
            <p>https://swenlii-delivery.ru/#orderPage/${orderId}</p>`;

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async youSelectContractor(email, username, contractor, orderId) {
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "You have chosen the contractor for your order";
        emailObj.htmlText =
            `<p>Good day, ${username}!<br />
            You have just selected user ${contractor} as the executor of your order. He will begin to implement soon. Link to your order:</p><br>
            <p>https://swenlii-delivery.ru/#orderPage/${orderId}</p>`;

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async notProvidePaymentDetail(email, username){
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "You did not provide payment details";
        emailObj.htmlText =
            `<p>Good day, ${username}!</p><br />
            <p>An error occurred while paying you funds for your referrals. You did not provide payment details. As soon as you provide the data, we will begin to pay you your funds.</p>
            <p>You can specify them here: https://swenlii-delivery.ru/#settings</p>`;

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async paidForYourRefers(email, username, paidType, paidInfo){
        let emailObj = {};
        emailObj.email = email;
        emailObj.subject = "You have been paid interest for your referrals.";
        emailObj.htmlText =
            `<p>Good day, ${username}!</p><br/>
            <p>You are paid interest for your referrals. Money Transfer Information:
                Where: ${paidType} <br/>
                Account / Card Number:${paidInfo}</p>
            <p>You can specify them here: https://swenlii-delivery.ru/#settings</p>`;

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }
}

module.exports = new EmailModel();
