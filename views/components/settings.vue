<!-- START CONTENT -->
<div class="content">

    <div class="page-header">
        <h1 class="title">Settings</h1>
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li><a href="#">Extra Pages</a></li>
            <li class="active">Settings</li>
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
    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <!-- START CONTAINER -->
    <div v-if="userObj" class="container-no-padding">

        <!-- Start Social Profile -->
        <div class="social-profile">

            <!-- Start Top -->
            <div class="social-top for-change-background" :style="'background: url(' + (userObj.backgroudProfilePath ? '/img/backgroundsProfile/' + userObj.backgroudProfilePath : '/img/background.jpg') + ')'">

                <div class="change-background-profile">
                    <label for="change-background"><i class="fa fa-camera" style="font-size: 18px; color: white;"></i></label>
                    <input @change="changeBackground" style="width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1;" type="file" class="form-control form-control-line" name="change-background" id="change-background">
                </div>

                <div class="profile-left">
                    <label for="avatar-change" class="avatar-change">
                        <img :src="userObj.avatarPath ? '/img/users/' + userObj.avatarPath : '/img/user-avatar-placeholder.png'" alt="img" id="avatar-in-settings" class="profile-img">
                        <i class="fa fa-camera for-avatar"></i>
                    </label>
                    <input @change="changeAvatar" style="width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1;" type="file" class="form-control form-control-line" name="avatar-change" id="avatar-change">
                    <h1 class="name">{{fullName}} <a href="#" class="btn btn-danger"><i class="fa fa-frown-o"></i>Delete Accaunt</a></h1>
                    <p class="profile-text">
                        <i v-if="profileData.online && profileData.online === 'online'" class="fa fa-eye" style="color: #26a65b;"></i>
                        <i v-else-if="profileData.online" class="fa fa-eye-slash" v-else></i>
                        {{profileData.online ? profileData.online : ''}}
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

                <div class="panel-body" style="margin-top: 60px;">
                    <form class="form-horizontal" v-on:submit="saveChanges($event)">
                        <div class="form-group">
                            <label for="example6" class="col-sm-2 form-label">Full name</label>
                            <div class="col-sm-10">
                                <input v-model="fullName" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example6">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="example4" class="col-sm-2 form-label">E-mail</label>
                            <div class="col-sm-10">
                                <input v-model="email" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example4">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="example7" class="col-sm-2 form-label">Apartments</label>
                            <div class="col-sm-10">
                                <input v-model="apartments" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example7">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 form-label">Billing information</label>
                            <div class="col-sm-5">
                                <select class="selectpicker" id="paid-type" data-size="7" name="payment" autofocus>
                                    <option value=""         data-icon="fa fa-ban" disabled selected>Nothing selected</option>
                                    <option value="bank"     data-icon="fa fa-university">Bank transfer</option>
                                    <option value="paypal"   data-icon="fa fa-paypal" style="color: #399bff">Paypal <span class="label label-danger" id="paypal-faster" style="margin-left: 15px">HOT</span></option>
                                </select>
                            </div>
                            <div class="col-sm-5" v-if="paidType === 'bank'">
                                <input v-model="paidInfo" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example7" placeholder="Card number" maxlength="150">
                            </div>
                            <div class="col-sm-5" v-if="paidType === 'paypal'">
                                <input v-model="paidInfo" style="background-color: #f4f4f4" type="text" class="form-control form-control-line" id="example8" placeholder="Your email or id in PayPal" maxlength="150">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-default">Save</button>
                    </form>

                </div>

                <div class="panel panel-default" style="margin-top: 60px;">

                    <div class="panel-title">
                        Change password
                    </div>

                    <div class="panel-body">
                        <form class="form-inline" v-on:submit="changePassword($event)">
                            <div class="form-group">
                                <input type="password" class="form-control" id="oldPassword" placeholder="Old password">
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="newPassword" placeholder="New password">
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" id="repeatPassword" placeholder="Repeat new password">
                            </div>
                            <button type="submit" class="btn btn-default">Change</button>
                        </form>
                    </div>

                </div>

                <div class="panel panel-default" style="margin-top: 60px;">

                    <div class="panel-title">
                        Your location
                    </div>

                    <div class="panel-body">
                        <form class="form-horizontal" v-on:submit="saveAddress($event)">
                            <div class="form-group" style="display: none" id="map-in-settings">
                                <label class="col-sm-2 control-label form-label">Map</label>
                                <div class="col-sm-10" style="min-height: 350px;" id="map-settings">
                                </div>
                            </div>

                            <div class="form-group" id="specifyAddressSettings" style="display: none">
                                <label class="col-sm-2 control-label form-label">Error</label>
                                <div class="col-sm-10" style="color: #ef4836">
                                    Specify the address. Enter the city, street, house. Or check the location on the map.
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label form-label">Address</label>
                                <div class="col-sm-10">
                                    <input name="location" type="text" class="form-control" id="location-settings" autofocus>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label form-label">Country</label>
                                <div class="col-sm-4">
                                    <input  type="text" class="form-control" v-model="address.country" id="country_settings" disabled required>
                                </div>
                                <label class="col-sm-2 control-label form-label">City  <i class="fa fa-info" id="cityTippy" style="color:#399bff"></i></label>
                                <div class="col-sm-4">
                                    <input type="text"  v-model="address.level_2" class="form-control" id="administrative_area_level_2_settings" disabled required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label form-label">Street</label>
                                <div class="col-sm-4">
                                    <input type="text" v-model="address.route" class="form-control" id="route_settings" disabled required>
                                </div>
                                <label class="col-sm-2 control-label form-label">House</label>
                                <div class="col-sm-4">
                                    <input type="text" v-model="address.house" class="form-control" id="street_number_settings" disabled required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-sm-2 control-label form-label"></label>
                                <div class="col-sm-2">
                                    <button class="btn btn-default">Save address</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
            <!-- End Social Content -->


        </div>
        <!-- End Social Profile -->

        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

    </div>
    <div v-else>

        <!-- //////////////////////////////////////////////////////////////////////////// -->
        <!-- START CONTAINER -->
        <div class="container-default">
            <h2>you need login</h2>

            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>



        </div>
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
<!-- End Content -->