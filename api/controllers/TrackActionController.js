// /**
//  * TrackActionController
//  *
//  * @description :: Server-side logic for managing Trackactions
//  * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
//  */
// createGpx = require('gps-to-gpx');
// gpxForRunners = require('gpx-for-runners');
// module.exports = {
//     getAllRoutes: (req, res) => {
//         Driver.findAll().exec((e, r) => res.ok({ r: r, e: e }));
//         // Driver
//         //     .find()
//         //     .exec((err, drivers) => drivers.map((el) => [el.name, this.getRoutesByDriver(el._id)]));
//     },

//     getGpxRoutesByDriver: (req, res) => {
//         var driverId = req.params.id;
//         Driver
//             .find({ where: { id: driverId } })
//             .populate('trackActions')
//             .sort('trackActions.time ASC')
//             .exec(function (err, driver) {
//                 var route = [];
//                 var routes = driver[0].trackActions.reduce((acc, el) => {
//                     if (el.isStart) {
//                         route = [];
//                         route.push(el);
//                     } else if (el.isEnd) {
//                         route.push(el);
//                         acc.push(route);
//                     } else {
//                         route.push(el);
//                     }
//                     return acc;

//                 }, []);
//                 var gpx = routes.map(e => createGpx.default(e, { latKey: "lat", lonKey: "lon" }));
//                 var labels = routes.map(e => e[0].time || "");
//                 var ends = routes.map(e => e[e.length - 1].time || "");
//                 res.json({
//                     "driver": driver,
//                     "labels": labels,
//                     "ends": ends,
//                     "gpx": gpx
//                 });
//             });
//     },

//     getReportData: (req, res) => {
//         Driver
//             .find()
//             .populate('trackActions')
//             .sort('trackActions.time ASC')
//             .exec(function (err, driver) {
//                 var drivers = driver
//                     .map(d => {
//                         if (!driver[0].trackActions || driver[0].trackActions.length == 0)
//                             return {
//                                 "name": d.name,
//                                 "empty": true
//                             };
//                         var route = [];
//                         var routes = d.trackActions.reduce((acc, el) => {
//                             if (el.isStart) {
//                                 route = [];
//                                 route.push(el);
//                             } else if (el.isEnd) {
//                                 route.push(el);
//                                 acc.push(route);
//                             } else {
//                                 route.push(el);
//                             }
//                             return acc;

//                         }, []);
//                         var gpx = routes.map(e => createGpx.default(e, { latKey: "lat", lonKey: "lon" }));
//                         var startList = routes.map(e => e[0].time || "");
//                         var ends = routes.map(e => e[e.length - 1].time || "");
//                         return {
//                             "name": d.name,
//                             "startList": startList,
//                             "endList": ends,
//                             "infoList": [],
//                             "totalValue": 0,
//                             "totalDistance": 0,
//                             "gpx": gpx
//                         };
//                     });
//                 res.json(drivers);
//             });
//     }

// };