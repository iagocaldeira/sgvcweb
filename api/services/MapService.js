// import createGpx from 'gps-to-gpx';
// import gpsUtil from "gps-util";

module.exports = {

    generateGPX: function (waypoints) {
        return createGpx(waypoints, { activityName: "Route", startTime: waypoints[0].time });
    },

    // getProperties: function () {

    // }

}