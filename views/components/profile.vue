<!-- START CONTENT -->
<div class="content">
    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <div class="page-header">
        <h1 class="title">Public profile of {{profileData && profileData.name ? profileData.name : 'user'}} </h1>
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li><a href="#">Profiles</a></li>
        </ol>
        <!-- End Page Header Right Div -->

    </div>
    <!-- START CONTAINER -->
    <div v-if="profileData && profileData.name" class="container-no-padding">

        <!-- Start Social Profile -->
        <div class="social-profile">

            <!-- Start Top -->
            <div class="social-top" :style="'background: url(' + (profileData.backgroudProfilePath ? '/img/backgroundsProfile/' + profileData.backgroudProfilePath : '/img/background.jpg') + ')'">

                <div class="profile-left">
                    <div class="profile-img" :style="'background-image: url(' + (profileData.avatarPath ? '/img/users/' + profileData.avatarPath : '/img/user-avatar-placeholder.png') + '); position: relative'">
                        <div v-if="profileData.online && profileData.online === 'online'" style="position: absolute; content: ''; height: 16px; width: 16px; background-color: #26a65b; bottom: 7px; right: 7px; display: block; border: 2px solid #fff; box-shadow: 0 2px 3px rgba(0,0,0,0.3); border-radius: 50%;"></div>
                    </div>
                    <!--img :src="profileData.avatarPath ? '/img/users/' + profileData.avatarPath : '/img/user-avatar-placeholder.png'" alt="img" class="profile-img"-->
                    <h1 class="name">
                        {{profileData.name}}
                        <a v-if="profileData.isCustomer === 1" href="#" class="btn btn-rounded btn-option1"><i class="fa fa-user"></i>Customer</a>
                        <a v-else href="#" class="btn btn-rounded btn-info"><i class="fa fa-truck"></i>Courier</a>
                    </h1>
                    <p class="profile-text">
                        <i v-if="profileData.online && profileData.online === 'online'" class="fa fa-eye" style="color: #26a65b;"></i>
                        <i v-else-if="profileData.online" class="fa fa-eye-slash" v-else></i>
                        {{profileData.online === 'online' ? 'online' : 'was ' + profileData.online}}
                        <i style="color: #26a65b; margin-left: 25px"  class="fa fa-thumbs-o-up"></i> <b>{{profileData.likes}}</b> likes
                        <i style="color: #ef4836; margin-left: 25px"  class="fa fa-thumbs-o-down"></i> <b>{{profileData.dislikes}}</b> dislike</p>
                </div>

                <ul class="social-stats">
                    <li><b>{{profileData.ordersCount}}</b> orders</li>
                    <li><b>{{profileData.answersCount}}</b> answers</li>
                    <li><b>{{profileData.commentsCount}}</b> comments</li>
                </ul>

            </div>
            <!-- End Top -->

            <!-- Start Social Content -->
            <div class="social-content clearfix">
                <div class="col-md-6 col-lg-4" v-for="review in profileData.reviews">
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
                                <li style="color: #26a65b" v-if="review.rating === 1"> <i class="fa  fa-thumbs-o-up"></i> Like</li>
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
            </div>
            <!-- End Social Content -->


        </div>
        <!-- End Social Profile -->



    </div>
    <div v-else>
        <!-- //////////////////////////////////////////////////////////////////////////// -->
        <!-- START CONTAINER -->
        <div class="container-default">
            <h2>profile not found</h2>
        </div>
    </div>
    <!-- END CONTAINER -->
    <!-- //////////////////////////////////////////////////////////////////////////// -->

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
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
<!-- End Content -->