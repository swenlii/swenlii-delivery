<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">My commissions</h1>
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


        <div v-if="userObj && userObj.isCustomer === 0">
            <ul class="topstats clearfix">
                <li class="arrow"></li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-dot-circle-o"></i> Earned today</span>
                    <h3>{{userObj.earnedToday}}</h3>
                    <span class="diff"><b :class="userObj.percentYesterday > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.percentYesterday > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.percentYesterday}}%</b> from yesterday</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-calendar-o"></i>  Earned in a week</span>
                    <h3>{{userObj.earnedWeek}}</h3>
                    <span class="diff"><b :class="userObj.percentWeek > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.percentWeek > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.percentWeek}}%</b> from last week</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-history"></i> Earned all time</span>
                    <h3 :class="userObj.earnedAllTime > 0 ? 'color-up': ''">{{userObj.earnedAllTime}}</h3>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-shopping-cart"></i> Order count</span>
                    <h3 :class="userObj.ordersLastMonth > 0 ? 'color-up' : ''">{{userObj.ordersCount}}</h3>
                    <span class="diff"><b :class="userObj.ordersLastMonth > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.ordersLastMonth > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.ordersLastMonth}}</b> from last month</span>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-exclamation-circle"></i> Need pay commissions</span>
                    <h3>{{needPayCommissions}}</h3>
                </li>
                <li class="col-xs-6 col-lg-2">
                    <span class="title"><i class="fa fa-check-circle-o"></i>Paid commissions</span>
                    <h3 :class="paidCommission > 0 ? 'color-up' : ''">{{paidCommission}}</h3>
                </li>
            </ul>
        </div>


        <div v-if="userObj && userObj.isCustomer === 0" class="panel-body table-responsive">
            <div class="panel col-md-10 col-lg-6" style="margin-top: 60px;" id="all-payment-panel">

                <div class="panel-title">
                    Payment
                    <ul class="panel-tools">
                        <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                        <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                    </ul>
                </div>

                <div class="panel-body">
                    <p>
                        You have unpaid commissions for {{selectedOrder}} orders<br>
                        <b>Earned: </b>{{selectedOrder}}<br>
                        <b>Commission 3%: </b>{{paymentCount}}$<br>
                        <b>Total: </b>{{paymentCount}}$<br>
                    </p>
                    <div id="all-paypal-button-container"></div>

                </div>

            </div>

        </div>

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