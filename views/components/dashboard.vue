<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">Home</h1>
        <ol class="breadcrumb">
            <li class="active">This is a quick overview of some features</li>
        </ol>

        <!-- Start Page Header Right Div -->
        <div class="right">
            <div class="btn-group" role="group" aria-label="...">
                <a href="index.html" class="btn btn-light">Home</a>
                <a href="#" class="btn btn-light"><i class="fa fa-refresh"></i></a>
                <a href="#" class="btn btn-light"><i class="fa fa-search"></i></a>
                <a href="#" class="btn btn-light" id="topstats"><i class="fa fa-line-chart"></i></a>
            </div>
        </div>
        <!-- End Page Header Right Div -->

    </div>
    <!-- End Page Header -->


    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <!-- START CONTAINER -->
    <div class="container-widget">

        <h1 style="text-align: center">WELCOME TO SWENLII'S DELIVERY!</h1>
        <h3 style="text-align: center; margin-bottom: 15px">We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win.</h3>

        <div class="row" v-if="userObj">
            <div class="col-md-12">

                <!-- Start Quick Menu -->
                <ul class="panel quick-menu clearfix">
                    <li class="col-sm-2">
                        <a href="/#profile"><i class="fa fa-smile-o"></i>My Profile</a>
                    </li>
                    <li class="col-sm-2">
                        <a href="/#settings"><i class="fa fa-cogs"></i>Settings</a>
                    </li>
                    <li class="col-sm-2">
                        <a href="/#personal-area"><i class="fa fa-user"></i>Personal Area</a>
                    </li>
                    <li class="col-sm-2">
                        <a href="/#my-orders"><i class="fa fa-cubes"></i>My orders<span v-if="myOrdersCount !== 0" class="label label-danger">{{myOrdersCount}}</span></a>
                    </li>
                    <li class="col-sm-2">
                        <a href="/#reviews-page"><i class="fa fa-users"></i>My reviews</a>
                    </li>
                    <li class="col-sm-2">
                        <a href="/logout/"><i class="fa fa-power-off"></i>Logout</a>
                    </li>
                </ul>
                <!-- End Quick Menu -->

            </div>
        </div>
        <!-- End Row -->

        <!-- Start Top Stats -->
        <div class="col-md-12" v-if="userObj">
            <ul class="topstats clearfix">
                <li class="arrow"></li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-dot-circle-o"></i> {{userObj.isCustomer === 1 ? 'Today spent' : 'Earned today'}}</span>
                    <h3>{{userObj.isCustomer === 1 ? userObj.spentToday : userObj.earnedToday}}</h3>
                    <span class="diff"><b :class="userObj.percentYesterday > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.percentYesterday > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.percentYesterday}}%</b> from yesterday</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-calendar-o"></i>  {{userObj.isCustomer === 1 ? 'Spent a week' : 'Earned in a week'}}</span>
                    <h3>{{userObj.isCustomer === 1 ? userObj.spentWeek : userObj.earnedWeek}}</h3>
                    <span class="diff"><b :class="userObj.percentWeek > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.percentWeek > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.percentWeek}}%</b> from last week</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-history"></i> {{userObj.isCustomer === 1 ? 'Spent all time ' : 'Earned all time'}}</span>
                    <h3 :class="userObj.spentAllTime > 0 || userObj.earnedAllTime > 0 ? 'color-up': ''">{{userObj.isCustomer === 1 ? userObj.spentAllTime : userObj.earnedAllTime}}</h3>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-cubes"></i> Order count</span>
                    <h3 :class="userObj.ordersLastMonth > 0 ? 'color-up' : ''">{{userObj.ordersCount}}</h3>
                    <span class="diff"><b :class="userObj.ordersLastMonth > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.ordersLastMonth > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.ordersLastMonth}}</b> from last month</span>
                </li>
                <li class="col-xs-6 col-lg-2" v-if="userObj.isCustomer === 0">
                    <span class="title"><i class="fa fa-users"></i> Answers count</span>
                    <h3>{{userObj.answersCount}}</h3>
                    <span class="diff"><b :class="userObj.answersLastMonth > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.answersLastMonth > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.answersLastMonth}}</b> from last month</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-comments"></i> Comments count</span>
                    <h3>{{userObj.commentsCount}}</h3>
                    <span class="diff"><b :class="userObj.commentsLastMonth > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.commentsLastMonth > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.commentsLastMonth}}</b> from last month</span>
                </li>
            </ul>
        </div>
        <!-- End Top Stats -->


        <!-- Start First Row -->
        <div class="row">

            <!-- Start Orders -->
            <div class="col-md-15 col-lg-8">
                <div class="panel panel-widget" id="all-orders">
                    <div class="panel-title">
                        LAST ORDERS <span class="label label-warning">{{orders.length}}</span>
                        <ul class="panel-tools">
                            <li><a class="icon"><i class="fa fa-refresh"></i></a></li>
                            <li><a class="icon search-tool"><i class="fa fa-search"></i></a></li>
                            <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
                            <li @click="allOrders"><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                            <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                        </ul>
                    </div>

                    <div class="panel-search">
                        <form>
                            <input type="text" id="searchInOrders" class="form-control" placeholder="Search..." v-on:keyup="searchInOrders">
                            <i class="fa fa-search icon"></i>
                        </form>
                    </div>


                    <div class="panel-body table-responsive">

                        <table class="table table-hover table-striped">
                            <thead>
                            <tr>
                                <td>Status</td>
                                <td>Order ID</td>
                                <td>Product</td>
                                <td>Buyer</td>
                                <td>Date</td>
                                <td>Payment</td>
                                <td>Shipping fee</td>
                                <td>Cost of goods</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(order, index) in orders" v-if="index < countOrders">
                                <td class="text-center">
                                    <i v-if="order.closeOrder === 1" class="fa fa-ban order-close-icon"
                                       style="font-size: 20px; color: #ef4836"></i>
                                    <i v-else-if="order.completedOrder === 1" class="fa fa-check-circle-o order-performed-icon"
                                       style="font-size: 20px; color: #26a65b"></i>
                                    <i v-else-if="order.contractorId" class="fa fa-clock-o order-wait-icon"
                                       style="font-size: 20px; color: #f39c12;"></i>
                                    <i v-else class="fa fa-circle-o order-open-icon"
                                       style="font-size: 20px; color: #399bff;"></i></td>
                                <td><a :href="'/#order-page/' + order.slug"># <b>{{order.id}}</b></a></td>
                                <td><a :href="'/#order-page/' + order.slug">{{order.title}}</a></td>
                                <td>{{order.name}}</td>
                                <td>{{order.datePost}}</td>
                                <td>{{order.payment}}</td>
                                <td>{{order.shippingFee}}</td>
                                <td>{{order.coastOfGoods}}</td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <!-- End Orders -->

            <!-- Start Files -->
            <div class="col-md-6 col-lg-4">
                <div class="panel panel-widget" id="all-cities" style="min-height:450px;">
                    <div class="panel-title">
                        Popular cities <span class="label label-danger">{{cities ? cities.length: 0}}</span>
                        <ul class="panel-tools">
                            <li><a class="icon search-tool"><i class="fa fa-search"></i></a></li>
                            <li @click="allCities"><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                            <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                        </ul>
                    </div>
                    <div class="panel-body table-responsive">

                        <table class="table table-dic table-hover ">
                            <tbody>
                            <tr>
                                <td><i class="fa fa-building"></i>City</td>
                                <td>Country</td>
                                <td class="text-r">Orders count</td>
                            </tr>
                            <tr v-for="(city, index) in cities" v-if="index < countCities">
                                <td><i class="fa fa-building-o"></i><a style="cursor: pointer;" @click="showOnlyCity(city.cityId)">{{city.name}}</a></td>
                                <td>{{city.country}}</td>
                                <td class="text-r">{{city.countOrders}}</td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <!-- End Files -->

        </div>
        <!-- End First Row -->

        <h5>We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win.</h5>
        <h5>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</h5>
        <h5>We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win.</h5>
        <h5>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</h5>
    </div>
    <!-- END CONTAINER -->
    <!-- //////////////////////////////////////////////////////////////////////////// -->

    <!-- Start Footer -->
    <div class="row footer">
        <div class="col-md-6 text-left">
            Copyright © 2015 <a href="http://themeforest.net/user/egemem/portfolio" target="_blank">Egemem</a> All
            rights reserved.
        </div>
        <div class="col-md-6 text-right">
            Design and Developed by <a href="http://themeforest.net/user/egemem/portfolio"
                                       target="_blank">Egemem</a>
        </div>
    </div>
    <!-- End Footer -->


</div>