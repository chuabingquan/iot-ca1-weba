var express = require('express');
var router = express.Router();
var Sound = require('../models/sound');

/* GET home page. */
router.route('/getTopNuisanceYesterday')
    .get((req, res, next) => {

        // Generate necessary query timestamps 
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth() + 1;
        var currentDate = currentDate.getDate() - 1;
        var startTime = '00:00:00.000';
        var endTime = '23:59:59:999';

        var gteTimestamp = currentYear + '-' + currentMonth + '-' + currentDate + ' ' + startTime;
        var lteTimestamp = currentYear + '-' + currentMonth + '-' + currentDate + ' ' + endTime;

        // Find top 3 max soundValue documents
        Sound.find({ 'createdAt': { '$gte': gteTimestamp, '$lte': lteTimestamp } }).sort({value: -1}).limit(3)
            .then((instance) => {
                res.json(instance);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: 'Failed to retrieve top 3 nuisance from yesterday!' });
            });
    });

module.exports = router;