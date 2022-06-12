var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var client = require('redis').createClient();
var helmet = require('helmet');
var fs = require('fs');
var nodemailer = require('nodemailer')


Number.prototype.trimNum = function (places, rounding) {
    rounding = rounding || "round";
    var num = parseFloat(this), multiplier = Math.pow(10, places);
    return (Number(Math[rounding](num * multiplier) / multiplier));
}



var express = require('express'),
    app = module.exports.app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(helmet.noCache());

let CONSTANTS = require('./CONSTANTS');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
var pool = require('./models/DBConnectionModel').returnPoolConnection();
var basicAPI = require('./api')(io);
let authModel = require('./models/AuthModel');
let ordersModel = require('./models/OrdersModel');
let geoModel = require('./models/GeoModel');
let commissionsModel = require('./models/CommissionsModel');
let reviewsModel = require('./models/ReviewsModel');
//var braintree = require('braintree');
//var gateway = braintree.connect({
//    accessToken: CONSTANTS.payPalAccessToken
//});

server.listen(3085, function () {
    console.log('Example app here! 3095');
});

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');    // security

app.use(function (req, res, next) {
    console.log('auth?');
    if (req.cookies && req.cookies.username && req.cookies.username.length > 1) {
        console.log('auth by username');
        console.log(req.cookies.username, req.cookies.password);
        authModel.loginUser({userName: req.cookies.username, password: req.cookies.password})
            .then(userObj => {
                req.userObj = userObj;
                next();
            })
            .catch(e => {
                req.userObj = null;
                console.log('User has cookie, but error in loginUser', e);
                next();
            })
    } else {
        console.log('no auth');
        req.userObj = null;
        next();
    }
});

app.get('/', (req, res) => {
    var obj = {
        title: 'Swenli\'s Delivery',
        userObj: req.userObj,
        mapsGoogleApiKey: CONSTANTS.mapsGoogleApiKey,
        payPalCurrency: CONSTANTS.payPalCurrency,
        payPalClientId: CONSTANTS.payPalClientId,
        payPalEnv: CONSTANTS.payPalEnv,
        orders: {},
        cities: {}
    };
    res.render('appVue', obj);
});

app.get('/logout/', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('password');
    res.redirect('/');
});

app.get('/register', (req, res) => {
    res.render('register',{title: 'Register on Delivery', userObj: req.userObj, mapsGoogleApiKey: CONSTANTS.mapsGoogleApiKey});
});

app.get('/login', (req, res) => {
    res.render('login',{title: 'Login on Delivery', userObj: req.userObj});
});

app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword',{title: 'Forgot password on Delivery', userObj: req.userObj});
});

app.get('/reset-password/reset_token=:token', (req, res) => {
    res.render('resetPassword',{title: 'Reset password on Delivery', userObj: req.userObj, token: req.params.token});
});

app.get('/data/:refid', (req, res) => {
    var date = new Date(Date.now());
    date.setFullYear(date.getFullYear() + 2);
    res.cookie('refid', req.params.refid, {expires: new Date(Date.now() + 63072000000)}); // add two years
    res.redirect('/');
});

app.post('/paypal-webhook/', (req, res) => {
    if (!req.body){
        res.status(400).send({status: 400, message: "Data is not find"});
    }
    let payPalObj = req.body;
    if (payPalObj && payPalObj.event_type === 'CHECKOUT.ORDER.APPROVED' && payPalObj.resource){
        var payment = payPalObj.resource;
        if (payment && payment.status === 'COMPLETED'){
            commissionsModel.getCommission(payment.id)
                .then(obj => {
                    if (obj.id){
                        if (obj.alreadyPaid === 0){
                            return commissionsModel.setTransactionCompleted(obj.id);
                        }
                        else {
                            res.status(200).send({status: 200, message: 'Double webhook. Payment has already been completed. ' + JSON.stringify(payment)});
                        }
                    }
                    else {
                        res.status(400).send({status: 200, message: "Payment not found! " + JSON.stringify(payment)});
                    }
                })
                .then(obj => {
                    res.status(200).send({status: 200, message: 'Payment completed! ' + JSON.stringify(payment)});
                })
                .catch(err => {
                    res.status(400).send({status: 400, message: "Payment not found! " + JSON.stringify(payment)});
                })
        }
        else {
            res.status(200).send({status: 200, message: 'PayPal payment is not completed. ' + JSON.stringify(payment)});
        }
    } else if (payPalObj && payPalObj.event_type === 'PAYMENT.CAPTURE.PENDING'){
        var payment = payPalObj.resource;
        if (payment && payment.status === 'PENDING'){
            commissionsModel.getCommission(payment.id)
                .then(obj => {
                    if (obj.id){
                        if (obj.alreadyPaid === 0){
                            return commissionsModel.setTransactionPending(obj.id);
                        }
                        else {
                            res.status(200).send({status: 200, message: 'Double webhook. Payment has already been completed. ' + JSON.stringify(payment)});
                        }
                    }
                    else {
                        res.status(400).send({status: 200, message: "Payment not found! " + JSON.stringify(payment)});
                    }
                })
                .then(obj => {
                    res.status(200).send({status: 200, message: 'Payment completed! ' + JSON.stringify(payment)});
                })
                .catch(err => {
                    res.status(400).send({status: 400, message: "Payment not found! " + JSON.stringify(payment)});
                })
        }
        else {
            res.status(200).send({status: 200, message: 'PayPal payment is not completed. ' + JSON.stringify(payment)});
        }
    } else if (payPalObj && payPalObj.event_type === 'PAYMENT.CAPTURE.DENIED'){
        var payment = payPalObj.resource;
        if (payment && payment.status === 'DECLINED'){
            commissionsModel.getCommission(payment.id)
                .then(obj => {
                    if (obj.id){
                        if (obj.alreadyPaid === 0){
                            return commissionsModel.setTransactionDeclined(obj.id);
                        }
                        else {
                            res.status(200).send({status: 200, message: 'Double webhook. Payment has already been completed. ' + JSON.stringify(payment)});
                        }
                    }
                    else {
                        res.status(400).send({status: 200, message: "Payment not found! " + JSON.stringify(payment)});
                    }
                })
                .then(obj => {
                    res.status(200).send({status: 200, message: 'Payment completed! ' + JSON.stringify(payment)});
                })
                .catch(err => {
                    res.status(400).send({status: 400, message: "Payment not found! " + JSON.stringify(payment)});
                })
        }
        else if (payPalObj.event_type === 'PAYMENT.REFERENCED-PAYOUT-ITEM.FAILED') {
            var payment = payPalObj.resource;
            if (payment && payment.transaction_status === 'FAILED') {
                commissionsModel.getCommission(payment.transaction_id)
                    .then(obj => {
                        if (obj.id) {
                            if (obj.alreadyPaid === 0) {
                                return ordersModel.setTransactionDeclined(obj.id);
                            } else {
                                res.status(200).send({
                                    status: 200,
                                    message: 'Double webhook. Payment has already been completed. ' + JSON.stringify(payment)
                                });
                            }
                        } else {
                            res.status(400).send({
                                status: 200,
                                message: "Payment not found! " + JSON.stringify(payment)
                            });
                        }
                    })
                    .then(obj => {
                        res.status(200).send({status: 200, message: 'Payment completed! ' + JSON.stringify(payment)});
                    })
                    .catch(err => {
                        res.status(400).send({status: 400, message: "Payment not found! " + JSON.stringify(payment)});
                    })
            }
        }
        else {
            res.status(200).send({status: 200, message: 'PayPal payment is not completed. ' + JSON.stringify(payment)});
        }
    }
});

