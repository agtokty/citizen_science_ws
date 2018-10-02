var promise = require('bluebird');
var CONFIG = require('../../appConfig');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var database = pgp(CONFIG.database.postgres);

function query(QUERY, cb) {
    database.result(QUERY)
        .then(function (result) {
            cb(null, "OK");
        })
        .catch(function (err) {
            cb(err);
        });
}

function getObservations(cb, start, end) {
    database.any('select * from observation')
        .then(function (data) {
            cb(null, data);
        })
        .catch(function (err) {
            cb(err)
        });
}

function getSingleObservation(code, cb) {
    database.one('select * from observation where CODE = $1', code)
        .then(function (data) {
            cb(null, data);
        })
        .catch(function (err) {
            cb(err);
        });
}

function insertObservation(data, cb) {
    database.none('insert into observation(CODE, LOC_DESC, LOC_LAT, LOC_LON, PROPERTY, INSERTED_AT, RECORDED_AT, MEASUREMENT, MEASUREMENT_TEXT, NOTE, IS_VALID, USER_CODE)' +
        ' values(${code}, ${loc_desc}, ${loc_lat}, ${loc_lon}, ${property}, current_timestamp, ${recorded_at}, ${measurement}, ${measurement_text}, ${note}, ${is_valid}, ${usercode} )'
        , data)
        .then(function () {
            cb(null, { result: "ok" })
        })
        .catch(function (err) {
            cb(err);
        });
}

function insertObservationBulk(data, cb) {
    database.tx(t => {
        var queries = data.map(u => {
            return t.none('insert into observation(CODE, LOC_DESC, LOC_LAT, LOC_LON, PROPERTY, INSERTED_AT, RECORDED_AT, MEASUREMENT, MEASUREMENT_TEXT, NOTE, IS_VALID, USER_CODE)' +
                ' values(${code}, ${loc_desc}, ${loc_lat}, ${loc_lon}, ${property}, current_timestamp, ${recorded_at}, ${measurement}, ${measurement_text}, ${note}, ${is_valid}, ${usercode} )', u);
        });
        return t.batch(queries);
    })
        .then(data => {
            cb(null, { result: "ok" })
        })
        .catch(error => {
            cb(error)
        });
}

function removeObservation(code, cb) {
    database.result('delete from observation where CODE = $1', code)
        .then(function (result) {
            cb(null, {
                status: 'ok',
                message: `Removed ${result.rowCount}`
            });
        })
        .catch(function (err) {
            cb(err);
        });
}

module.exports = {
    query: query,
    getObservations: getObservations,
    getSingleObservation: getSingleObservation,
    insertObservation: insertObservation,
    insertObservationBulk: insertObservationBulk,
    removeObservation: removeObservation
};