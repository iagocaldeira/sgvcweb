/**
 * TrackActionController
 *
 * @description :: Server-side logic for managing Trackactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
createGpx = require('gps-to-gpx');
gpxForRunners = require('gpx-for-runners');
module.exports = {
    getAllRoutes: function (req, res) {
        return Driver.findAll().exec(function (e, r) {
            return res.ok({ r: r, e: e });
        });
    },

    getGpxRoutesByDriver: function (req, res) {
        var driverId = req.params.id;
        Driver
            .find({ where: { id: driverId } })
            .populate('trackActions')
            .sort('trackActions.time ASC')
            .exec(function (err, driver) {
                var route = [];
                var routes = driver[0].trackActions.reduce(function (acc, el) {
                    if (el.isStart) {
                        route = [];
                        route.push(el);
                    } else if (el.isEnd) {
                        route.push(el);
                        acc.push(route);
                    } else {
                        route.push(el);
                    }
                    return acc;

                }, []);
                var gpx = routes.map(function (e) { return createGpx.default(e, { latKey: "lat", lonKey: "lon" }) });
                var labels = routes.map(function (e) { return e[0].time || "" });
                var ends = routes.map(function (e) { return e[e.length - 1].time || "" });
                res.json({
                    "driver": driver,
                    "labels": labels,
                    "ends": ends,
                    "gpx": gpx
                });
            });
    },

    getReportData: function (req, res) {
        Driver
            .find()
            .populate('trackActions')
            .sort('trackActions.time ASC')
            .exec(function (err, driver) {
                var drivers = driver
                    .map(function (d) {
                        if (!d.trackActions && d.trackActions.length == 0)
                            return {
                                "name": d.name,
                                "empty": true
                            };
                        var route = [];
                        var routes = d.trackActions.reduce(function (acc, el) {
                            if (el.isStart) {
                                route = [];
                                route.push(el);
                            } else if (el.isEnd) {
                                route.push(el);
                                acc.push(route);
                            } else {
                                route.push(el);
                            }
                            return acc;

                        }, []);
                        var gpx = routes.map(function (e) { return createGpx.default(e, { latKey: "lat", lonKey: "lon" }) });
                        if(gpx.length==0){
                            return {
                                "name": d.name,
                                "empty": true
                            }
                        }
                        var startList = routes.map(function (e) { return e[0].time || "" });
                        var ends = routes.map(function (e) { return e[e.length - 1].time || "" });
                        return {
                            "name": d.name,
                            "startList": startList,
                            "endList": ends,
                            "infoList": [],
                            "totalValue": 0,
                            "totalDistance": 0,
                            "gpx": gpx
                        };
                    });
                res.json(drivers);
            });
    }

};