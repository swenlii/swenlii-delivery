<div class="content">

    <!-- Start Page Header -->
    <div class="page-header">
        <h1 class="title">Create order</h1>
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


        <div class="panel panel-default">

            <div class="panel-title">
                Create new order
                <ul class="panel-tools">
                    <li><a class="icon minimise-tool"><i class="fa fa-minus"></i></a></li>
                    <li><a class="icon expand-tool"><i class="fa fa-expand"></i></a></li>
                    <li><a class="icon closed-tool"><i class="fa fa-times"></i></a></li>
                </ul>
            </div>

            <div class="panel-body">
                <form class="form-horizontal" name="createOrder" v-on:submit="createOrder($event)">

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Title</label>
                        <div class="col-sm-10">
                            <input v-model="newOrder.title" name="title" type="text" class="form-control" id="input11" autofocus required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Address</label>
                        <div class="col-sm-10">
                            <input name="location" type="text" class="form-control" id="location-new-order" autofocus required>
                        </div>
                    </div>
                    <div class="form-group" id="specifyAddress" style="display: none">
                        <label class="col-sm-2 control-label form-label">Error</label>
                        <div class="col-sm-10" style="color: #ef4836">
                            Specify the address. Enter the city, street, house. Or check the location on the map.
                        </div>
                    </div>

                    <div class="form-group" style="display: none" id="map-under-address">
                        <label class="col-sm-2 control-label form-label">Map</label>
                        <div class="col-sm-10" style="min-height: 350px;" id="map">

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Country</label>
                        <div class="col-sm-4">
                            <input v-model="address.country" type="text" class="form-control" id="country" disabled required>
                        </div>
                        <label class="col-sm-2 control-label form-label">City  <i class="fa fa-info" id="cityTippy" style="color:#399bff"></i></label>
                        <div class="col-sm-4">
                            <input type="text" v-model="address.level_2" class="form-control" id="administrative_area_level_2" disabled required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Street</label>
                        <div class="col-sm-4">
                            <input type="text" v-model="address.route" class="form-control" id="route" disabled required>
                        </div>
                        <label class="col-sm-2 control-label form-label">House</label>
                        <div class="col-sm-4">
                            <input type="text" v-model="address.house" class="form-control" id="street_number" disabled required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Apartment number <i class="fa fa-info" id="apartaments" style="color:#399bff"></i></label>
                        <div class="col-sm-4">
                            <input type="text" id="apartament_number" class="form-control">
                        </div>
                        <label class="col-sm-2 control-label form-label">Phone number</label>
                        <div class="col-sm-4">
                            <input type="tel" id="phone_number" class="form-control" placeholder="Phone number">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Shipping fee</label>
                        <div class="col-sm-4">
                            <input type="number" style="border-color: #399bff;" class="form-control" id="shippingFee" v-model="newOrder.shippingFee" required>
                        </div>
                        <label class="col-sm-2 control-label form-label">Currency</label>
                        <div class="col-sm-4">
                            <select class="selectpicker" id="select-currency" data-size="7" name="currency" data-width="100%" data-live-search="true" autofocus>
                                <option value="EUR"><div class="iti__flag-box"><div class="iti__flag" style="background-image: url('/img/flagsPhone/euro.png'); background-size: 20px 15px; background-position: 0px"></div></div><span class="iti__country-name">Euro</span>               <span class="iti__dial-code">EUR</span></option>
                                <option value="AUD"><div class="iti__flag-box"><div class="iti__flag iti__au"></div></div><span class="iti__country-name">Australian Dollar</span><span class="iti__dial-code">AUD</span></option>
                                <option value="BGN"><div class="iti__flag-box"><div class="iti__flag iti__bg"></div></div><span class="iti__country-name">Bulgarian Lev</span><span class="iti__dial-code">BGN</span></option>
                                <option value="BRL"><div class="iti__flag-box"><div class="iti__flag iti__br"></div></div><span class="iti__country-name">Brazilian Real</span><span class="iti__dial-code">BRL</span></option>
                                <option value="CAD"><div class="iti__flag-box"><div class="iti__flag iti__ca"></div></div><span class="iti__country-name">Canadian Dollar</span><span class="iti__dial-code">CAD</span></option>
                                <option value="CHF"><div class="iti__flag-box"><div class="iti__flag iti__ch"></div></div><span class="iti__country-name">Swiss Franc</span><span class="iti__dial-code">CHF</span></option>
                                <option value="CNY"><div class="iti__flag-box"><div class="iti__flag iti__cn"></div></div><span class="iti__country-name">Yuan Renminbi</span><span class="iti__dial-code">CNY</span></option>
                                <option value="CZK"><div class="iti__flag-box"><div class="iti__flag iti__cz"></div></div><span class="iti__country-name">Czech Koruna</span><span class="iti__dial-code">CZK</span></option>
                                <option value="DKK"><div class="iti__flag-box"><div class="iti__flag iti__dk"></div></div><span class="iti__country-name">Danish Krone</span><span class="iti__dial-code">DKK</span></option>
                                <option value="GBP"><div class="iti__flag-box"><div class="iti__flag iti__gb"></div></div><span class="iti__country-name">Pound Sterling</span><span class="iti__dial-code">GBP</span></option>
                                <option value="GEL"><div class="iti__flag-box"><div class="iti__flag iti__ge"></div></div><span class="iti__country-name">Lari</span><span class="iti__dial-code">GEL</span></option>
                                <option value="HKD"><div class="iti__flag-box"><div class="iti__flag iti__hk"></div></div><span class="iti__country-name">Hong Kong Dollar</span><span class="iti__dial-code">HKD</span></option>
                                <option value="HUF"><div class="iti__flag-box"><div class="iti__flag iti__hu"></div></div><span class="iti__country-name">Forint</span><span class="iti__dial-code">HUF</span></option>
                                <option value="INR"><div class="iti__flag-box"><div class="iti__flag iti__in"></div></div><span class="iti__country-name">Indian Rupee</span><span class="iti__dial-code">INR</span></option>
                                <option value="MYR"><div class="iti__flag-box"><div class="iti__flag iti__my"></div></div><span class="iti__country-name">Malaysian Ringgit</span><span class="iti__dial-code">MYR</span></option>
                                <option value="MXN"><div class="iti__flag-box"><div class="iti__flag iti__mx"></div></div><span class="iti__country-name">Mexican Peso</span><span class="iti__dial-code">MXN</span></option>
                                <option value="NOK"><div class="iti__flag-box"><div class="iti__flag iti__no"></div></div><span class="iti__country-name">Norwegian Krone</span><span class="iti__dial-code">NOK</span></option>
                                <option value="NZD"><div class="iti__flag-box"><div class="iti__flag iti__nz"></div></div><span class="iti__country-name">New Zealand Dollar</span><span class="iti__dial-code">NZD</span></option>
                                <option value="PLN"><div class="iti__flag-box"><div class="iti__flag iti__pl"></div></div><span class="iti__country-name">Zloty</span><span class="iti__dial-code">PLN</span></option>
                                <option value="RON"><div class="iti__flag-box"><div class="iti__flag iti__ro"></div></div><span class="iti__country-name">Romanian Leu</span><span class="iti__dial-code">RON</span></option>
                                <option value="SEK"><div class="iti__flag-box"><div class="iti__flag iti__se"></div></div><span class="iti__country-name">Swedish Krona</span><span class="iti__dial-code">SEK</span></option>
                                <option value="SGD"><div class="iti__flag-box"><div class="iti__flag iti__sg"></div></div><span class="iti__country-name">Singapore Dollar</span><span class="iti__dial-code">SGD</span></option>
                                <option value="THB"><div class="iti__flag-box"><div class="iti__flag iti__th"></div></div><span class="iti__country-name">Baht</span><span class="iti__dial-code">THB</span></option>
                                <option value="NGN"><div class="iti__flag-box"><div class="iti__flag iti__ng"></div></div><span class="iti__country-name">Naira</span><span class="iti__dial-code">NGN</span></option>
                                <option value="PKR"><div class="iti__flag-box"><div class="iti__flag iti__pk"></div></div><span class="iti__country-name">Pakistan Rupee</span><span class="iti__dial-code">PKR</span></option>
                                <option value="TRY"><div class="iti__flag-box"><div class="iti__flag iti__tr"></div></div><span class="iti__country-name">Turkish Lira</span><span class="iti__dial-code">TRY</span></option>
                                <option value="USD"><div class="iti__flag-box"><div class="iti__flag iti__us"></div></div><span class="iti__country-name">US Dollar</span><span class="iti__dial-code">USD</span></option>
                                <option value="ZAR"><div class="iti__flag-box"><div class="iti__flag iti__za"></div></div><span class="iti__country-name">Rand</span><span class="iti__dial-code">ZAR</span></option>
                                <option value="JPY"><div class="iti__flag-box"><div class="iti__flag iti__jp"></div></div><span class="iti__country-name">Yen</span><span class="iti__dial-code">JPY</span></option>
                                <option value="PHP"><div class="iti__flag-box"><div class="iti__flag iti__ph"></div></div><span class="iti__country-name">Philippine Peso</span><span class="iti__dial-code">PHP</span></option>
                                <option value="MAD"><div class="iti__flag-box"><div class="iti__flag iti__ma"></div></div><span class="iti__country-name">Moroccan Dirham</span><span class="iti__dial-code">MAD</span></option>
                                <option value="COP"><div class="iti__flag-box"><div class="iti__flag iti__co"></div></div><span class="iti__country-name">Colombian Peso</span><span class="iti__dial-code">COP</span></option>
                                <option value="AED"><div class="iti__flag-box"><div class="iti__flag iti__ae"></div></div><span class="iti__country-name">UAE Dirham</span><span class="iti__dial-code">AED</span></option>
                                <option value="IDR"><div class="iti__flag-box"><div class="iti__flag iti__id"></div></div><span class="iti__country-name">Rupiah</span><span class="iti__dial-code">IDR</span></option>
                                <option value="CLP"><div class="iti__flag-box"><div class="iti__flag iti__cl"></div></div><span class="iti__country-name">Chilean Peso</span><span class="iti__dial-code">CLP</span></option>
                                <option value="UAH"><div class="iti__flag-box"><div class="iti__flag iti__ua"></div></div><span class="iti__country-name">Hryvnia</span><span class="iti__dial-code">UAH</span></option>
                                <option value="GHS"><div class="iti__flag-box"><div class="iti__flag iti__gh"></div></div><span class="iti__country-name">Ghana Cedi</span><span class="iti__dial-code">GHS</span></option>
                                <option value="RUB"><div class="iti__flag-box"><div class="iti__flag iti__ru"></div></div><span class="iti__country-name">Russian Ruble</span><span class="iti__dial-code">RUB</span></option>
                                <option value="LKR"><div class="iti__flag-box"><div class="iti__flag iti__lk"></div></div><span class="iti__country-name">Sri Lanka Rupee</span><span class="iti__dial-code">LKR</span></option>
                                <option value="KRW"><div class="iti__flag-box"><div class="iti__flag iti__kr"></div></div><span class="iti__country-name">Won</span><span class="iti__dial-code">KRW</span></option>
                                <option value="VND"><div class="iti__flag-box"><div class="iti__flag iti__vn"></div></div><span class="iti__country-name">Dong</span><span class="iti__dial-code">VND</span></option>
                                <option value="BDT"><div class="iti__flag-box"><div class="iti__flag iti__bd"></div></div><span class="iti__country-name">Taka</span><span class="iti__dial-code">BDT</span></option>
                                <option value="NPR"><div class="iti__flag-box"><div class="iti__flag iti__np"></div></div><span class="iti__country-name">Nepalese Rupee</span><span class="iti__dial-code">NPR</span></option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Estimated cost of goods</label>
                        <div class="col-sm-4">
                            <input type="number" style="border-color: #399bff;" class="form-control" id="coastOfGoods" v-model="newOrder.coastOfGoods" required>
                        </div>
                        <label class="col-sm-2 control-label form-label">Payment type</label>
                        <div class="col-sm-4">
                            <select class="selectpicker" id="select-payment" data-size="7" data-width="100%" name="payment" autofocus>
                                <option value=""         data-icon="fa fa-ban" disabled selected>Nothing selected</option>
                                <option value="bank"     data-icon="fa fa-university">Bank transfer</option>
                                <option value="paypal"   data-icon="fa fa-paypal">Paypal</option>
                                <option value="cash"     data-icon="fa fa-money">Ready cash</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label form-label">Description</label>
                        <div class="col-sm-10">
                            <div id="summernote"></div>
                        </div>

                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit"  class="btn btn-default">Create order</button>
                        </div>
                    </div>

                </form>

            </div>

            <div class="panel panel-transparent">

                <div class="panel-title">
                    Registration status
                </div>

                <div class="panel-body">

                    <div role="tabpanel">

                        <!-- Nav tabs -->
                        <ul class="nav nav-pills nav-stacked col-md-2" role="tablist">
                            <li @click="changeRegistrationStatus('byId')" role="presentation" v-if="userObj" class="active" id="byIdClick"><a href="#logged-in" aria-controls="logged-in" role="tab" data-toggle="tab">Yor account</a></li>
                            <li @click="changeRegistrationStatus('newUser')" role="presentation" :class="userObj ? '' : 'active'" id="newUserClick"><a href="#new-registration" aria-controls="new-registration" role="tab" data-toggle="tab">New registration</a></li>
                            <li @click="changeRegistrationStatus('oldUser')" role="presentation" id="oldUserClick"><a href="#already-registered" aria-controls="already-registered" role="tab" data-toggle="tab">Already registered</a></li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content col-md-10">
                            <div role="tabpanel" v-if="userObj" class="tab-pane active" id="logged-in">
                                <p>Post this order from user: <b>{{userObj.name}}</b> <a href="/logout/">Logout?</a></p>
                            </div>
                            <div role="tabpanel" :class="'tab-pane ' + (newOrder.registrationStatus === 'newUser' ? 'active' : '')" id="new-registration">
                                <form class="form-horizontal" id="register-form" v-on:submit="registrationSubmit($event)">
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">Username</label>
                                        <div class="col-sm-10">
                                            <input id="new-username" type="text" class="form-control" placeholder="Username" min="3" max="300">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">E-mail</label>
                                        <div class="col-sm-10">
                                            <input id="new-email" type="text" class="form-control" placeholder="E-mail" min="4" max="150">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">Password</label>
                                        <div class="col-sm-10">
                                            <input v-on:input="repeatPasswordSuccess()" id="new-password" type="password" class="form-control" placeholder="Password" min="6" max="150">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">Repeat password</label>
                                        <div class="col-sm-10">
                                            <input v-on:input="repeatPasswordSuccess()" id="new-repeat-password" type="password" class="form-control" placeholder="Repeat password" min="6" max="150">
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
                            <div role="tabpanel" class="tab-pane" id="already-registered">
                                <form class="form-horizontal" id="login-form2" v-on:submit="loginSubmit($event)">
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">Username</label>
                                        <div class="col-sm-10">
                                            <input id="old-username2" type="text" class="form-control" placeholder="Username" min="3" max="300">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label form-label">Password</label>
                                        <div class="col-sm-10">
                                            <input id="old-password2" type="password" class="form-control" placeholder="Password" min="6" max="150">
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