var express = require('express');
var router = express.Router();
var util = require('../util');
var db = require('./db/queries');

var checkSingleObservation = function (observation) {
    observation.code = observation.code || util.generateUUID();
    observation.loc_desc = observation.loc_desc || null;
    observation.loc_lat = observation.loc_lat || 0;
    observation.loc_lon = observation.loc_lon || 0;
    observation.property = observation.property || null;
    observation.recorded_at = observation.recorded_at;

    if(!observation.measurement && observation.measurement != 0)
        observation.measurement = 0;

    observation.note = observation.note || null;
    observation.is_valid = (observation.is_active == true || observation.is_active == false) ? observation.is_active : true;
    observation.usercode = observation.usercode || null;
    observation.username = observation.username || null;

    return observation;
}

router.get('/observation', function (req, res) {
    db.getObservations(function (err, data) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(data);
        }
    });
});


router.post('/observation', function (req, res) {

    if (!req.body) {
        return res.status(400).send({ error: "İstek hatalı!", detail: "İstek body değeri boş" });
    }

    var postData = req.body;

    var observation = checkSingleObservation(postData);

    if (!observation.property)
        return res.status(400).send({ error: "Ölçüm bilgileri eksik!", detail: "property değeri değeri boş" });

    if (observation.measurement !=0 && !observation.measurement)
        return res.status(400).send({ error: "Ölçüm değeri eksik!" });

    db.insertObservation(observation, function (err, data) {
        if (err) {
            return res.sendStatus(500);
        } else {
            return res.status(201).send(data);
        }
    });

});


router.post('/observation/bulk', function (req, res) {

    if (!req.body) {
        return res.status(400).send({ error: "İstek hatalı!", detail: "İstek body değeri boş" });
    }

    var postData = req.body;

    if (!Array.isArray(postData)) {
        return res.status(400).send({ error: "İstek hatalı!", detail: "İstek verisi array şeklinde değil" });
    }

    var observationArrayNotValid = [];
    var observationArray = [];
    for (let i = 0; i < postData.length; i++) {
        var observation = checkSingleObservation(postData[i]);
        if (!observation.property || !observation.measurement) {
            observationArrayNotValid.push(observation.code)
            continue;
        }

        observationArray.push(observation);
    }

    if (observationArray.length === 0) {
        return res.status(400).send({ error: "İstek hatalı!", detail: "İstek içerisinde tutarlı ölçüm verisi bulunamadı" });
    }

    db.insertObservationBulk(observationArray, function (err, data) {
        if (err) {
            return res.sendStatus(500);
        } else {
            var data = data || {};
            data.rollback = observationArrayNotValid;
            return res.status(201).send(data);
        }
    });

});


module.exports = router;