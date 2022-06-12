<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">My orders</h1>
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


        <div v-if="userObj">
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
                    <span class="title"><i class="fa fa-shopping-cart"></i> Order count</span>
                    <h3 :class="userObj.ordersLastMonth > 0 ? 'color-up' : ''">{{userObj.ordersCount}}</h3>
                    <span class="diff"><b :class="userObj.ordersLastMonth > 0 ? 'color-up' : 'color-down'">
                        <i :class="userObj.ordersLastMonth > 0 ? 'fa fa-caret-up': 'fa fa-caret-down'"></i> {{userObj.ordersLastMonth}}</b> from last month</span>
                </li>
                <li class="col-xs-6 col-lg-2" v-if="userObj.isCustomers === 0">
                    <span class="title"><i class="fa fa-exclamation-circle"></i> Need pay commissions</span>
                    <h3>{{needPayCommissions}}</h3>
                </li>
                <li class="col-xs-6 col-lg-2" v-if="userObj.isCustomers === 0">
                    <span class="title"><i class="fa fa-check-circle-o"></i>Paid commissions</span>
                    <h3 :class="paidCommission > 0 ? 'color-up' : ''">{{paidCommission}}</h3>
                </li>
            </ul>
        </div>


        <div v-if="userObj" class="panel-body table-responsive">

            <table class="table table-hover table-striped" v-if="orders.length > 0">
                <thead>
                <tr>
                    <td>Status</td>
                    <td>Order ID</td>
                    <td>Product</td>
                    <td>Buyer</td>
                    <td>Date</td>
                    <td>Payment</td>
                    <td>Shipping fee</td>
                    <td>Coast of goods</td>
                    <td>{{userObj.isCustomer === 0 ? 'Commissions' : 'Control'}}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="order in orders">
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
                    <td>
                        <div v-if="order.contractorId === userObj.id">
                            <div>
                                <div :id="'commissionBlock' + order.id">
                                    <div v-if="order.transactionId && order.satatus !== 'declined' && order.satatus !== 'completed'"><i class="fa fa-check" style="color: #f39c12"></i> Payment accepted for processing</div>
                                    <div v-else-if="order.transactionId && (order.satatus === 'completed' || order.alreadyPaid === 1)"><i class="fa fa-check" style="color: #26a65b"></i> Already paid</div>
                                    <a v-else-if="order.commissionCount" style="cursor: pointer; display: block" :id="'payButton' + order.id" @click="addToPayment(order.id, order.commissionCount)" class="btn btn-default"><i class="fa fa-check"></i>Add {{order.commissionCount}} to payment</a>
                                    <div v-else><i class="fa fa-ban" :id="'payNotCompleted' + order.id" style="color: #f39c12"></i> Order not completed</div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="order.closeOrder === 0 && order.completedOrder === 0">
                                <div class="btn-group">
                                    <a v-if="order.contractorId" @click="performedOrder(order)" style="cursor: pointer" class="btn btn-success btn-icon"><i class="fa fa-check"></i></a>
                                    <a @click="closeOrderClick(order)" style="cursor: pointer" class="btn btn-danger btn-icon"><i class="fa fa-times"></i></a>
                                </div>
                            </div>
                            <div v-else-if="order.closeOrder === 1">
                                <i class="fa fa-times" style="color: #ef4836"></i> Closed
                            </div>
                            <div v-else-if="order.completedOrder === 1">
                                <i class="fa fa-check" style="color: #26a65b"></i> Preformed
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <h4 v-else>You have no orders yet</h4>

            <div class="panel col-md-6 col-lg-4" style="margin-top: 60px;" id="payment-panel">

                <div class="panel-title">
                    Payment
                    <ul class="panel-tools">
                        <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                        <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                    </ul>
                </div>

                <div class="panel-body">
                    <p>
                        <b>Orders selected: </b>{{selectedOrder}}<br>
                        <b>Commission 3%: </b>{{paymentCount}}$<br>
                        <b>Total: </b>{{paymentCount}}$<br>
                    </p>
                    <div id="paypal-button-container"></div>

                </div>

            </div>

        </div>

        <h4 v-if="!userObj">You need login</h4>

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