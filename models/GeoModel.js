var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
let emailModel = require('./EmailModel');
let authModel = require('./AuthModel');
let CONSTANTS = require('../CONSTANTS');
var slugify  = require('slugify');

class GeoModel {
    constructor() {

    }

    async getCountryObj(countryCode, countryName) {

        // check if exist
        try {
            var cResult = await pool.query("SELECT * FROM countries WHERE country_code = ?", [countryCode])
        } catch (e) {
            throw new Error(e)
        }

        if (cResult.length > 0) {
            return cResult[0];
        }

        // if not exist, go insert
        try {
            var result = await pool.query("INSERT INTO countries (country_name, country_code)  VALUES (?, ?)", [countryName, countryCode])
        } catch (e) {
            throw new Error(e)
        }

        if (result.insertId > 0){
            try {
                var countries = await pool.query("SELECT * FROM countries WHERE id = ?", [result.insertId])
            } catch (e) {
                throw new Error(e)
            }

            if (countries.length > 0) {
                return countries[0]
            } else {
                throw new Error('error get country from DB')
            }
        } else {
            throw new Error('error insert country in DB')
        }
    }

    async getCityObj(englishName, countryId, geoName = '') {

        try {
            var city = await pool.query("SELECT * FROM cities WHERE englishName = ?", [englishName]);
        } catch (e) {
            throw new Error(e)
        }

        if (city.length > 0) {
            return  city[0];
        }

        try {
            var result = await pool.query("INSERT INTO cities (englishName, geoName, countryId) VALUES (?,?,?)", [englishName, geoName, countryId]);
        } catch (e) {
            throw new Error(e)
        }

        if (result.insertId > 0){
            try {
                var cities = await pool.query("SELECT * FROM cities WHERE id = ?", [result.insertId])
            } catch (e) {
                throw new Error(e)
            }

            if (cities.length > 0) {
                return cities[0]
            } else {
                throw new Error('error get country from DB')
            }
        } else {
            throw new Error('error insert country in DB')
        }
    }

    async getCityRating () {
        try {
            var cities = await pool.query("SELECT orders.cityId, cities.englishName AS name, cities.countryId FROM orders LEFT JOIN cities ON cities.id = orders.cityId GROUP BY orders.cityId");
        } catch (e) {
            throw new Error(e)
        }

        for (var i = 0; i < cities.length; i++){
            try {
                var count = await pool.query(`SELECT * FROM orders WHERE cityId = ?`, cities[i].cityId);
            } catch (e) {
                throw new Error(e)
            }
            cities[i].countOrders = count.length;
            try {
                var country = await pool.query(`SELECT * FROM countries WHERE id = ?`, cities[i].countryId);
            } catch (e) {
                throw new Error(e)
            }
            cities[i].country = country[0].country_name;
        }
        return cities;
    }
}

module.exports = new GeoModel();