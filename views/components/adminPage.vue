<div class="content" v-if="userObj && userObj.id === 1">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">Admin Page</h1>
        <ol class="breadcrumb">
            <li><a href="index.html">Home</a></li>
            <li><a href="#">Extra Pages</a></li>
            <li class="active">Blank Page</li>
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
    <!-- End Page Header -->

    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <!-- START CONTAINER -->
    <div class="container-default">
        <div class="social-content clearfix">
            <div class="panel panel-default">

                <div class="panel-title">
                    Referees
                </div>

                <div class="panel-body table-responsive">
                    <p v-if="persons.length > 0">Users that distribute referral links. Only users who need to pay their share are displayed.</p>
                    <p v-else>There are no users who need to pay their share.</p>

                    <table v-if="persons.length > 0" class="table table-striped">
                        <thead>
                        <tr>
                            <td>User ID</td>
                            <td>Username</td>
                            <td>Date registered</td>
                            <td>Earned</td>
                            <td>Already Paid</td>
                            <td>Need paid</td>
                            <td>Last refill</td>
                            <td>Share</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="person in persons">
                            <td># <b>{{person.id}}</b></td>
                            <td>{{person.name}}</td>
                            <td>{{person.dateFormat}}</td>
                            <td>{{person.needPaid}}</td>
                            <td>{{person.historicalPaid ? person.historicalPaid : 0}}</td>
                            <td>{{person.needPaid - (person.historicalPaid ? person.historicalPaid : 0)}}</td>
                            <td>{{person.dateNotPaid ? person.dateNotPaid : ''}}</td>
                            <td><a @click="paidShare(person, person.earnedAllTime - (person.historicalPaid ? person.historicalPaid : 0))" :style="'cursor: pointer; ' + ((person.earnedAllTime - (person.historicalPaid ? person.historicalPaid : 0)) > 5 ? '' : 'background-color:#e4e4e4; color: #58666e')" class="btn btn-default"><i class="fa fa-check"></i>Pay share</a></td>
                        </tr>
                        </tbody>
                    </table>
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