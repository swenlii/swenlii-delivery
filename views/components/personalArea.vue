<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">Personal Area</h1>
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
        <div class="social-content clearfix" v-if="userObj">
            <div class="form-horizontal">
                <div class="form-group" v-if="!userObj.myRefId">
                    <label class="col-sm-2 control-label form-label">Referral link</label>
                    <div class="col-sm-10">
                        <button @click="createRefLink" type="submit"  class="btn btn-default">Create referral link</button>
                    </div>
                </div>
                <div class="form-group" v-if="userObj.myRefId">
                    <label class="col-sm-2 control-label form-label">Referral link</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" :value="link">
                    </div>
                    <div class="col-sm-1">
                        <button @click="copyLink" type="submit"  class="btn btn-default">Copy</button>
                    </div>
                </div>
                <div class="form-group" v-if="userObj.myRefId">
                    <label class="col-sm-2 form-label">Billing information</label>
                    <div class="col-sm-5">
                        <select class="selectpicker" id="paid-type" data-size="7" name="payment" autofocus>
                            <option value=""         data-icon="fa fa-ban" disabled selected>Nothing selected</option>
                            <option value="bank"     data-icon="fa fa-university">Bank transfer</option>
                            <option value="paypal"   data-icon="fa fa-paypal" style="color: #399bff">Paypal <i class="fa fa-exclamation" id="paypal-faster"></i></option>
                        </select>
                    </div>
                    <div class="col-sm-5" v-if="paidType === 'bank'">
                        <input v-model="paidInfo" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example7" placeholder="Card number" maxlength="150">
                    </div>
                    <div class="col-sm-5" v-if="paidType === 'paypal'">
                        <input v-model="paidInfo" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example8" placeholder="Your email or id in PayPal" maxlength="150">
                    </div>
                </div>
            </div>

            <div class="panel panel-default">

                <div class="panel-title">
                    Your referrals
                </div>

                <div class="panel-body table-responsive">
                    <p v-if="persons.length > 0">Here are all the users who are registered through your referral link and are couriers. Minimum payout: 500</p>
                    <p v-else>Here will be presented all users who register as your couriers on your referral link.</p>

                    <table v-if="persons.length > 0" class="table table-striped">
                        <thead>
                        <tr>
                            <td>User ID</td>
                            <td>Username</td>
                            <td>Date registered</td>
                            <td>Earned</td>
                            <td>Paid commission</td>
                            <td>Your share</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="person in persons">
                            <td># <b>{{person.id}}</b></td>
                            <td>{{person.name}}</td>
                            <td>{{person.dateFormat}}</td>
                            <td>{{person.earnedAllTime}}</td>
                            <td>{{person.comissions}}</td>
                            <td>{{person.needPaid}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td><b>TOTAL</b></td>
                            <td></td>
                            <td></td>
                            <td>Earned all time</td>
                            <td>Already paid</td>
                            <td>Not paid</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{earnedAllTime}}</td>
                            <td>{{userObj.historicalPaid ? userObj.historicalPaid : 0}}</td>
                            <td>{{earnedAllTime - (userObj.historicalPaid ? userObj.historicalPaid : 0)}}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>


        <div v-else >
            <h1>You need to login</h1>
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