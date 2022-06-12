<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">Reviews Page</h1>
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li><a href="#">Extra Pages</a></li>
            <li class="active">Blank Page</li>
        </ol>

        <!-- Start Page Header Right Div -->
        <div class="right">
            <div class="btn-group" role="group" aria-label="...">
                <a href="/" class="btn btn-light">Home</a>
                <a @click="location.reload()" class="btn btn-light"><i class="fa fa-refresh"></i></a>
                <a href="/#blank" class="btn btn-light"><i class="fa fa-search"></i></a>
                <a href="/#blank" class="btn btn-light" id="topstats"><i class="fa fa-line-chart"></i></a>
            </div>
        </div>
        <!-- End Page Header Right Div -->

    </div>
    <!-- End Page Header -->

    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <!-- START CONTAINER -->
    <div class="container-default">

        <div v-if="userObj" class="row">

            <!-- Start Tab Panel -->
            <div class="padding-0">
                <div class="panel panel-transparent">
                    <div class="panel-body">
                        <div role="tabpanel">
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs nav-justified font-title-tab" role="tablist">
                                <li role="presentation" class="active"><a href="#need-reviews" aria-controls="need-reviews" role="tab" data-toggle="tab">Orders without reviews</a></li>
                                <li role="presentation"><a href="#my-reviews" aria-controls="my-reviews" role="tab" data-toggle="tab">My reviews</a></li>
                                <li role="presentation"><a href="#reviews-for-me" aria-controls="reviews-for-me" role="tab" data-toggle="tab">Reviews on me</a></li>
                            </ul>

                            <!-- Tab panes -->
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane active" id="need-reviews" style="overflow: hidden">
                                    <div class="panel-title">
                                        Orders without reviews
                                    </div>
                                    <div class="col-md-6 col-lg-4" v-for="order in needReviews">
                                        <div class="panel panel-default">

                                            <div class="panel-title">
                                                <a :href="'#order-page/' + order.slug">{{order.title}}</a>
                                            </div>

                                            <div class="panel-body">
                                                <ul class="list-unstyled list">
                                                    <li><i class="fa fa-user"></i><b> User: </b><a :href="'/#profile/' + order.user_id">{{order.userName}}</a></li>
                                                    <li><i class="fa fa-map-marker"></i><b> Address: </b>{{order.address}}</li>
                                                    <li><i class="fa fa-clock-o"></i><b> Date completed: </b>{{order.dateComplete}}</li>
                                                </ul>
                                            </div>

                                            <div class="panel-footer">
                                                <a class="btn btn-default btn-rounded" data-toggle="collapse" :href="'#collapseExample' + order.slug" aria-expanded="false" aria-controls="collapseExample">
                                                    Write a review
                                                </a>
                                                <div class="collapse margin-t-10" :id="'collapseExample' + order.slug">
                                                    <div class="well">
                                                        <form>
                                                            <div class="form-group" style="overflow: hidden">
                                                                <div class="col-md-12 col-lg-12" style="margin-bottom: 15px">
                                                                    <button type="button" @click="clickRating(1)" class="btn btn-rounded btn-success btn-icon"><i class="fa fa-thumbs-o-up"></i></button>
                                                                    <span>I liked the execution of the order!</span>
                                                                </div>
                                                                <div class="col-md-12 col-lg-12">
                                                                    <button type="button" @click="clickRating(-1)" class="btn btn-rounded btn-danger btn-icon"><i class="fa fa-thumbs-down"></i></button>
                                                                    <span>I am not satisfied with the order!</span>
                                                                </div>

                                                            </div>
                                                            <div class="form-group" v-if="rating !== 0" style="margin-top: 15px">
                                                                <label class="form-label">{{rating === -1 ? 'Sorry. What didn’t you like?' : 'Thank. What did you like the most?'}}</label>
                                                                <textarea class="form-control" rows="3" v-model="reviewText" :placeholder="rating === -1 ? 'I didn’t like that ...' : 'I liked that ...'"></textarea>
                                                            </div>
                                                            <button  @click="postReview(order.user_id, order.order_id, $event)" v-if="rating !== 0 && reviewText.length > 4" class="btn btn-success btn-rounded">Post</button>
                                                        </form>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <div v-if="needReviews.length === 0">
                                        You have no orders for which a review is needed.
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="reviews-for-me" style="overflow: hidden">
                                    <div class="panel-title">
                                        Reviews on me
                                    </div>
                                    <div class="col-md-6 col-lg-4" v-for="review in reviewsForMe">
                                        <div class="panel panel-default" :style="review.rating === -1 ? 'box-shadow: 0 0 10px #ef4836; border-color: #f5a79e;' : 'box-shadow: 0 0 10px #26a65b; border-color: #72da9d;'">
                                            <div class="panel-body status">
                                                <div class="who clearfix">
                                                    <a :href="'/#profile/' + review.user_id" class="avatar" :style="'position: relative; background-image: url(' + (review.avatarPath ? 'img/users/' + review.avatarPath : 'img/user-avatar-placeholder.png') + ')'">
                                                        <div v-if="usersOnline && usersOnline[review.user_id]" style="position: absolute; content: ''; height: 12px; width: 12px; background-color: #26a65b; bottom: 0px; right: 0px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                                                    </a>
                                                    <span class="name"><a :href="'/#profile/' + review.user_id"><b>{{review.name}}</b></a> shared a review</span>
                                                    <span class="from">{{review.dateReview}}</span>
                                                </div>
                                                <ul class="links" style="padding-bottom: 0px">
                                                    <li style="color: #26a65b" v-if="review.rating === 1"> <i class="fa fa-thumbs-o-up"></i> Like</li>
                                                    <li style="color: #ef4836" v-if="review.rating === -1"> <i class="fa fa-thumbs-down"></i> Not like</li>
                                                </ul>
                                                <div class="text" style="padding-top: 0px">
                                                    <div class="panel-body">
                                                        <ul class="list-unstyled list">
                                                            <li><i class="fa fa-cube"></i><b> Order: </b><a :href="'/#order-page/' + review.slug">{{review.title}}</a></li>
                                                            <li><i class="fa fa-clock-o"></i><b> Date completed: </b>{{review.dateComplete}}</li>
                                                        </ul>
                                                    </div>
                                                    {{review.text}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="reviewsForMe.length === 0">
                                        No reviews have been written to you yet.
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="my-reviews" style="overflow: hidden">
                                    <div class="panel-title">
                                        My reviews
                                    </div>
                                    <div class="col-md-6 col-lg-4" v-for="review in myReviews">
                                        <div class="panel panel-default" :style="review.rating === -1 ? 'box-shadow: 0 0 10px #ef4836; border-color: #f5a79e;' : 'box-shadow: 0 0 10px #26a65b; border-color: #72da9d;'">
                                            <div class="panel-title">
                                                {{review.text.slice(0, 18) + '...'}}
                                                <ul class="panel-tools">
                                                    <li>
                                                        <a href="#" data-toggle="dropdown" class="dropdown-toggle">Actions<span class="caret"></span></a>
                                                        <ul class="dropdown-menu dropdown-menu-right">
                                                            <li><a style="cursor: pointer" @click="editText(review.id, review.text)">Edit text</a></li>
                                                            <li><a style="cursor: pointer" @click="editRating(review.id)">Edit rating</a></li>
                                                            <li><a style="cursor: pointer" @click="deleteReview(review.id)">Delete</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="panel-body status">
                                                <ul class="links" style="padding-bottom: 0px">
                                                    <li style="color: #26a65b" v-if="review.rating === 1"> <i class="fa fa-thumbs-o-up"></i> Like</li>
                                                    <li style="color: #ef4836" v-if="review.rating === -1"> <i class="fa fa-thumbs-down"></i> Not like</li>
                                                </ul>
                                                <div class="text" style="padding-top: 0px">
                                                    <div class="panel-body">
                                                        <ul class="list-unstyled list">
                                                            <li><i class="fa fa-user"></i><b> To user: </b><a :href="'/#profile/' + review.user_id">{{review.name}}</a></li>
                                                            <li><i class="fa fa-cube"></i><b> Order: </b><a :href="'/#order-page/' + review.slug">{{review.title}}</a></li>
                                                            <li><i class="fa fa-clock-o"></i><b> Date post: </b>{{review.dateReview}}</li>
                                                        </ul>
                                                    </div>
                                                    {{review.text}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="myReviews.length === 0">
                                        You have not written a single review yet.
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>

        <h4 v-else>You need login</h4>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>



    </div>
    <!-- END CONTAINER -->
    <!-- //////////////////////////////////////////////////////////////////////////// -->


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