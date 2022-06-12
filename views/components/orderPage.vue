<div class="content">
    <!-- Start Page Header -->
    <div v-if="oneOrder" class="page-header">
        <h1 class="title">Order Page</h1>
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li><a href="#">Extra Pages</a></li>
            <li class="active">Order Page</li>
        </ol>

        <!-- Start Page Header Right Div -->
        <div class="right" v-if="oneOrder && userObj && userObj.id === oneOrder.userId && oneOrder.closeOrder === 0 && oneOrder.completedOrder === 0">
            <div class="btn-group" role="group" aria-label="...">
                <a v-if="oneOrder.contractorId" @click="performedOrder" style="cursor: pointer" class="btn btn-success"><i class="fa fa-check"></i>Performed</a>
                <a @click="closeOrderClick" style="cursor: pointer" class="btn btn-danger"><i class="fa fa-times"></i>Close order</a>
            </div>
        </div>
        <div class="right" v-else-if="oneOrder && oneOrder.closeOrder === 1">
            <i class="fa fa-times" style="color: #ef4836"></i> Order canceled
        </div>
        <div class="right" v-else-if="oneOrder && oneOrder.completedOrder === 1">
            <i class="fa fa-check" style="color: #26a65b"></i> Order completed
        </div>
        <!-- End Page Header Right Div -->

    </div>
    <!-- End Page Header -->

    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <!-- START CONTAINER -->
    <div v-if="oneOrder" class="container-default">


        <!-- Start Presentation -->
        <div class="row presentation">

            <div class="col-lg-8 col-md-6 titles">
                <a :href="'/#profile/' + oneOrder.userId" class="avatar-in-order" :style="(oneOrder.avatarPath ? 'background-image: url('+ '/img/users/' + oneOrder.avatarPath + ');' : '') + ' position: relative'">
                    <div v-if="usersOnline && usersOnline[oneOrder.userId]" style="position: absolute; content: ''; height: 16px; width: 16px; background-color: #26a65b; bottom: -5px; right: -5px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                </a>
                <h1 style="margin-top: 50px">{{oneOrder.title}}</h1>
                <a :href="'/#profile/' + oneOrder.userId">
                    <h4>{{oneOrder.name}}
                        <span style="font-size: 15px">
                            <i style="color: #26a65b; margin-left: 15px"  class="fa fa-thumbs-o-up"></i>
                            <b>{{oneOrder.likes ? oneOrder.likes : '0'}}</b> likes
                            <i style="color: #ef4836; margin-left: 15px"  class="fa fa-thumbs-o-down"></i>
                            <b>{{oneOrder.dislikes ? oneOrder.dislikes : '0'}}</b> dislike
                        </span>
                    </h4>
                </a>
                <h5 v-if="oneOrder.review && oneOrder.review.rating" :style="oneOrder.review.rating === 1 ? 'color: #26a65b' : 'color: #ef4836'"><i class="fa fa-thumbs-o-up"></i> {{oneOrder.review.rating === 1 ? 'Customer satisfied with courier' : 'Customer is not satisfied with order fulfillment'}}</h5>
            </div>

            <div class="col-lg-4 col-md-6">
                <ul class="list-unstyled list">
                    <li><i class="fa fa-info"></i><b>Info:</b></li>
                    <li><i class="fa fa-map-marker"></i><b> Address: </b>{{oneOrder.address}}</li>
                    <li v-if="oneOrder.apartaments"><i class="fa fa-building"></i>
                        <b> Apartaments: </b>
                        <span :style="userObj && (userObj.id === oneOrder.contractorId || userObj.id === oneOrder.userId) ? '' : 'filter: blur(3px);-webkit-filter: blur(3px);'">{{oneOrder.apartaments}}</span></li>
                    <li v-if="oneOrder.phoneNumber"><i class="fa fa-mobile"></i><b> Phone: </b>{{oneOrder.phoneNumber}}</li>
                    <li><i class="fa fa-money"></i><b>Payment: </b>{{oneOrder.payment}}</li>
                    <li><i class="fa fa-clock-o"></i><b> Date post: </b>{{oneOrder.datePost}}</li>
                    <li><i style="color: #f39c12" class="fa fa-dollar"></i><b> Shipping fee: </b>{{oneOrder.shippingFee}} <span v-if="oneOrder.currency">{{oneOrder.currency}}</span></li>
                    <li><i style="color: #f39c12" class="fa fa-dollar"></i><b> Estimated cost of goods: </b>{{oneOrder.coastOfGoods}} <span v-if="oneOrder.currency">{{oneOrder.currency}}</span></li>
                </ul>
            </div>

        </div>
        <!-- End Presentation -->

        <div class="panel panel-default" style="display: none">

            <div class="panel-title">
                Information
            </div>

            <div class="panel-body">
                <p style="white-space: pre-wrap;"><b>Address: </b>{{oneOrder.address}}</p>
                <p style="white-space: pre-wrap;"><b>Payment: </b>{{oneOrder.payment}}</p>
                <p style="white-space: pre-wrap;"><b>Date post: </b>{{oneOrder.datePost}}</p>
                <p style="white-space: pre-wrap; color: #f39c12"><b>Shipping fee: </b>{{oneOrder.shippingFee}}            </p>
                <p style="white-space: pre-wrap; color: #f39c12"><b>Estimated cost of goods: </b>{{oneOrder.coastOfGoods}}</p>
            </div>
        </div>

        <div class="panel panel-default">

            <div class="panel-title">
                Description
            </div>

            <div class="panel-body">
                <p style="white-space: pre-wrap;" v-html="oneOrder.description"></p>
            </div>

        </div>

        <div class="panel panel-default" v-if="showFormPostAnswer()">

            <div class="panel-title">
                Post answer
                <ul class="panel-tools">
                    <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
                    <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                    <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                </ul>
            </div>

            <div class="panel-body" >
                <form v-if="userObj.isCustomer === 0" v-on:submit="postAnswer($event)">
                    <div class="form-group">
                        Your name: {{userObj ? userObj.name : 'anonim'}}
                    </div>
                    <div class="form-group">
                        <label class="form-label">Answer</label>
                        <textarea class="form-control" rows="3" id="answerText">I want to fulfill this order!</textarea>
                    </div>
                    <button type="submit" class="btn btn-default">Post</button>
                </form>
                <div class="form-group" v-else>
                    You cannot leave answers on orders because you are logged in as a customer
                </div>

            </div>
        </div>
        <div class="panel panel-default" v-else-if="!oneOrder.contractorId && oneOrder.closeOrder === 0 && oneOrder.completedOrder === 0 && !userObj" >

            <div class="panel-title">
                Post answer
                <ul class="panel-tools">
                    <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
                    <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                    <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                </ul>
            </div>

            <div class="panel-body" >
                <div role="tabpanel">

                    <!-- Nav tabs -->
                    <ul class="nav nav-pills nav-stacked col-md-2" role="tablist">
                        <li role="presentation" @click="" class="active" id="newUserClick"><a href="#new-registration2" aria-controls="new-registration" role="tab" data-toggle="tab">New registration</a></li>
                        <li role="presentation" @click="" id="oldUserClick"><a href="#already-registered2" aria-controls="already-registered" role="tab" data-toggle="tab">Already registered</a></li>
                    </ul>

                    <!-- Tab panes -->
                    <div class="tab-content col-md-10">
                        <div role="tabpanel" class="tab-pane active" id="new-registration2">
                            <form class="form-horizontal" id="register-form" v-on:submit="registrationSubmit($event)">
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">Username</label>
                                    <div class="col-sm-10">
                                        <input id="new-username2" type="text" class="form-control" placeholder="Username" min="3" max="300">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">E-mail</label>
                                    <div class="col-sm-10">
                                        <input id="new-email2" type="text" class="form-control" placeholder="E-mail" min="4" max="150">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">Password</label>
                                    <div class="col-sm-10">
                                        <input v-on:input="repeatPasswordSuccess()" id="new-password2" type="password" class="form-control" placeholder="Password" min="6" max="150">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">Repeat password</label>
                                    <div class="col-sm-10">
                                        <input v-on:input="repeatPasswordSuccess()" id="new-repeat-password2" type="password" class="form-control" placeholder="Repeat password" min="6" max="150">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        The data you entered will not be lost upon registration
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <button type="submit"  class="btn btn-default">Registration</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="already-registered2">
                            <form class="form-horizontal" id="login-form2" v-on:submit="loginSubmit($event)">
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">Username</label>
                                    <div class="col-sm-10">
                                        <input id="old-username" type="text" class="form-control" placeholder="Username" min="3" max="300">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label form-label">Password</label>
                                    <div class="col-sm-10">
                                        <input id="old-password" type="password" class="form-control" placeholder="Password" min="6" max="150">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <button type="submit"  class="btn btn-default">Login</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div>

            <!-- Start Post -->
            <div class="panel panel-default" v-for="answer in oneOrder.answers">
                <div class="panel-body status">
                    <ul class="panel-tools panel-tools-hover">
                        <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                        <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                    </ul>
                    <div class="who clearfix">
                        <a :href="'/#profile/' + answer.userId" class="avatar" :style="'position: relative; background-image: url(' + (answer.avatarPath ? 'img/users/' + answer.avatarPath : 'img/user-avatar-placeholder.png') + ')'">
                            <div v-if="usersOnline && usersOnline[answer.userId]" style="position: absolute; content: ''; height: 12px; width: 12px; background-color: #26a65b; bottom: 0px; right: 0px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                        </a>
                        <span class="name">
                            <a :href="'/#profile/' + answer.userId"><b>{{answer.name}}</b></a>
                            <i v-if="oneOrder.contractorId && answer.userId === oneOrder.contractorId" class="fa fa-check-circle selectedContractor" style="font-size: 18px; color: #26a65b;"></i>
                            answered your order
                        </span>
                        <span class="from"><b>{{answer.dateFormat}}</b></span>
                    </div>
                    <div class="text" style="white-space: pre-wrap">{{answer.answerText}}</div>
                    <ul class="links">
                        <li v-if="userObj && userObj.id === oneOrder.userId && !oneOrder.contractorId && oneOrder.closeOrder === 0 && oneOrder.completedOrder === 0"><a href="#" @click="selectContractor(answer.userId)" class="btn btn-rounded btn-default">Select contractor</a></li>
                        <li><a style="cursor: pointer" @click="likeClick(answer.id, answer.likeCount)"><i class="fa fa-thumbs-o-up"></i> {{!answer.likeCount || answer.likeCount === '' ? 0 : answer.likeCount.split('/').length}} Likes</a></li>
                        <li><a href="#"><i class="fa fa-comment-o"></i> Comment</a></li>
                        <li><a href="#"><i class="fa fa-share-square-o"></i> Share</a></li>
                    </ul>
                    <ul class="comments">
                        <li v-for="comment in answer.comments">
                            <a :href="'/#profile/' + comment.userId" class="avatar" :style="'background-image: url(' + (comment.avatarPath ? 'img/users/' + comment.avatarPath : 'img/user-avatar-placeholder.png') + ')'">
                                <div v-if="usersOnline && usersOnline[comment.userId]" style="position: absolute; content: ''; height: 11px; width: 11px; background-color: #26a65b; bottom: 0px; right: 0px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                            </a>
                            <a :href="'/#profile/' + comment.userId" class="name">{{comment.name}}</a>
                            {{comment.commentText}}
                        </li>
                        <li v-if="userObj && (userObj.id === oneOrder.userId || userObj.id === answer.userId)">
                            <a :href="'/#profile/' + userObj.id" class="avatar" :style="'background-image: url(' + (userObj.avatarPath ? 'img/users/' + userObj.avatarPath : 'img/user-avatar-placeholder.png') + ')'">
                                <div v-if="usersOnline && usersOnline[userObj.id]" style="position: absolute; content: ''; height: 11px; width: 11px; background-color: #26a65b; bottom: 0px; right: 0px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                            </a>
                            <!--img :src="userObj.avatarPath ? '/img/users/' + userObj.avatarPath : '/img/user-avatar-placeholder.png'" alt="img"-->
                            <input type="text" :id="'comment' + answer.id" class="form-control post-comment-on-answer" v-on:keypress="postComment($event, answer.id)" placeholder="Post your comment...">
                        </li>
                    </ul>
                </div>
            </div>
            <!-- End Post -->
        </div>
        <!-- End Right -->

        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

    </div>
    <!-- END CONTAINER -->
    <!-- //////////////////////////////////////////////////////////////////////////// -->


    <div v-if="!oneOrder" class="page-header">
        <h1 class="title">Order Page</h1>
        <ol class="breadcrumb">
            <li><a href="index.html">Dashboard</a></li>
            <li><a href="#">Extra Pages</a></li>
            <li class="active">Order Page</li>
        </ol>

        <!-- Start Page Header Right Div -->
        <div class="right">
            <div class="btn-group" role="group" aria-label="...">
                <a href="/" class="btn btn-light">Dashboard</a>
                <a @click="location.reload()" class="btn btn-light"><i class="fa fa-refresh"></i></a>
                <a href="/#blank" class="btn btn-light"><i class="fa fa-search"></i></a>
                <a href="/#blank" class="btn btn-light" id="topstats"><i class="fa fa-line-chart"></i></a>
            </div>
        </div>
        <!-- End Page Header Right Div -->

    </div>
    <div v-if="!oneOrder" class="container-default">
        <h4>Invalid order link</h4>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>

    <!-- Start Footer -->
    <div class="row footer">
        <div class="col-md-6 text-left">
            Copyright © 2015 <a href="http://themeforest.net/user/egemem/portfolio" target="_blank">Egemem</a> All rights reserved.
        </div>
        <div class="col-md-6 text-right">
            Design and Developed by <a href="http://themeforest.net/user/egemem/portfolio" target="_blank">Egemem</a>
        </div>
    </div>
    <!-- End Footer -->


</div>