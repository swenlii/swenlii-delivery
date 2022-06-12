let nodeGeocoder = require('node-geocoder');
let authModel = require('./models/AuthModel');
let ordersModel = require('./models/OrdersModel');
var emailModel = require('./models/EmailModel');
var commissionsModel = require('./models/CommissionsModel');
var reviewsModel = require('./models/ReviewsModel');
let geoModel = require('./models/GeoModel');
var braintree = require('braintree');
let CONSTANTS = require('./CONSTANTS');
var crypto = require('crypto');
//var gateway = braintree.connect({
//    accessToken: CONSTANTS.payPalAccessToken
//});

exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {

        var usersBySocket = {};
        var usersById = {};

        console.log("here is basic API");
        var sessionid = socket.id;
        console.log(' %s sockets connected', io.engine.clientsCount);
        console.log("and here is socket.id", socket.id);

        socket.on('login', function(data){
            console.log('a user ' + data.userId + ' connected');
            // saving userId to array with socket ID
            usersBySocket[socket.id] = data.userId;
            usersById[data.userId] = socket.id;
            socket.broadcast.emit('userConnect', data.userId);
            socket.emit('usersOnline', usersById);
        });

        socket.on('isOnline', function (id, callback) {
            if (usersById[id]){
                callback(null, 'online');
            } else {
                authModel.getLatOnline(id)
                    .then(time => {
                        callback(null, 'was ' + time);
                    })
                    .catch(err => {
                        callback(err.message, null);
                    });
            }
        });

        socket.on('register-user', function (obj, callback) {
            authModel.registerUser(obj)
                .then(id => {
                    callback(null, id);
                })
                .catch(err => {
                    if (err.message.toString().includes('No recipients defined')){
                        callback('Your email is not valid', null);
                    }
                    else {
                        callback(err.message, null);
                    }
                })
        });

        socket.on('login-user', function (obj, callback) {
            authModel.loginUser(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('forgot-password', function (obj, callback) {
            console.log('forgot-pass');
            authModel.forgotPass(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('reset-password', function (obj, callback) {
            authModel.resetPass(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('findOrdersByRadius', function (obj, callback) {
            ordersModel.getOrdersInRadius(obj.lat, obj.long)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('postOrder', function (obj, callback) {
            var userObj = null;
            if (obj.registrationStatus === 'newUser') {
                obj.isCustomers = 1;
                authModel.registerUser(obj)
                    .then(user => {
                        userObj = user;
                        obj.userId = user.id;
                        return ordersModel.postOrder(obj)
                    })
                    .then(obj => {
                        callback(null, userObj);
                    })
                    .catch(err => {
                        if (err.message.toString().includes('No recipients defined')){
                            callback('Your email is not valid', userObj);
                        }
                        else {
                            callback(err.message, userObj);
                        }
                    })
            } else if (obj.registrationStatus === 'oldUser') {
                authModel.loginUser(obj)
                    .then(user => {
                        userObj = user;
                        obj.userId = user.id;
                        return ordersModel.postOrder(obj)
                    })
                    .then(obj => {
                        callback(null, userObj);
                    })
                    .catch(err => {
                        if (err.message.includes('No recipients defined')){
                            callback(null, userObj);
                        }
                        else {
                            callback(err.message, userObj);
                        }
                    });
            } else {
                ordersModel.postOrder(obj)
                    .then(obj => {
                        callback(null, obj);
                    })
                    .catch(err => {
                        if (err.message.includes('No recipients defined')){
                            callback(null, 'ok');
                        }
                        else {
                            callback(err.message, null);
                        }
                    })
            }
        });

        socket.on('postAnswer', function (obj, callback) {
            ordersModel.postAnswer(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('postComment', function (obj, callback) {
            ordersModel.postComment(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('selectContractor', function (obj, callback) {
            ordersModel.selectContractor(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('likeClick', function (obj, callback) {
            ordersModel.likeClick(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('getProfileById', function (id, callback) {
            authModel.getProfileById(id)
                .then(obj => {
                    if (usersById[id]){
                        obj.online = 'online';
                    }
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('saveProfileChanges', function (obj, callback) {
            authModel.saveProfileChanges(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('changePassword', function (obj, callback) {
            authModel.changePassword(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('changeBackground', function (obj, callback) {
            authModel.changeBackground(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('changeAvatar', function (obj, callback) {
            authModel.changeAvatar(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('deleteAccount', function (id, callback) {
            authModel.deleteAccount(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('performedOrder', function (id, callback) {
            ordersModel.performedOrder(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('closeOrder', function (id, callback) {
            ordersModel.closeOrder(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('getCitiesRating', function (obj, callback) {
            geoModel.getCityRating()
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('getUserCommissions', function (id, callback) {
            commissionsModel.getUserComissions(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('generateClientToken', function (obj, callback) {
            callback(null, 'response.clientToken');
            //gateway.clientToken.generate({}, function (err, response) {
            //    if (err) {
            //        callback(err.message, null);
            //    } else {
            //        callback(null, response.clientToken);
            //    }
            //});
        });

        socket.on('transactionCreate', function (obj, callback) {
            commissionsModel.transactionCreate(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('generateRefId', function (id, callback) {
            var refId =  crypto.randomBytes(4).readUInt32BE();
            console.log(refId);
            authModel.saveRefId(id, refId)
                .then(obj => {
                    callback(null, refId);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('getUsersRegMyRefId', function (id, callback) {
            authModel.getUsersRegMyRefId(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('getUsersWithRegRefId', function (callback) {
            authModel.getUsersWithRegRefId()
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('paidToUser', function (obj, callback) {
            authModel.paidToUser(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('sendEmailNotPaymentDetails', function (obj, callback) {
            emailModel.notProvidePaymentDetail(obj.email, obj.username)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('getForReviewsPage', function (userId, callback) {
            reviewsModel.getForRewiewsPage(userId)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('postReview', function (obj, callback) {
            reviewsModel.postReview(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('editTextOnReview', function (obj, callback) {
            reviewsModel.editTextOnReview(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('editRatingOnReview', function (obj, callback) {
            reviewsModel.editRatingOnReview(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('deleteReview', function (id, callback) {
            reviewsModel.deleteReview(id)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        });

        socket.on('disconnect', function(){
            console.log('user ' + usersBySocket[socket.id] + ' disconnected');
            authModel.disconnectUser(usersBySocket[socket.id])
                .then(ok => {
                    socket.broadcast.emit('userDisconnect', {userId: usersBySocket[socket.id], lastOnline: ok});
                    delete usersById[usersBySocket[socket.id]];
                    delete usersBySocket[socket.id];
                })
                .catch(err => {
                    socket.broadcast.emit('userDisconnect', {error: err.message});
                    delete usersById[usersBySocket[socket.id]];
                    delete usersBySocket[socket.id];
                });
        });

        socket.on('changeAddressUser', function (obj, callback) {
            authModel.changeAddressUser(obj)
                .then(obj => {
                    callback(null, obj);
                })
                .catch(err => {
                    callback(err.message, null);
                });
        })
    });
};