var app = angular.module('MapsApp', ['ngMaterial']);

app.controller('AppCtrl', ['$scope', '$mdSidenav', 'routeService', '$timeout', '$log', '$http', function ($scope, $mdSidenav, routeService, $timeout, $log, $http) {
    var precoKM = 0.7;
    var loaded = false;
    var renderPrint = false;
    L.Mapzen.apiKey = 'mapzen-LcAMRTq';
    var route = L.Mapzen.map('map').setView([-19.8157, -43.9542], 15)
        .on('loaded', function (e) {
            loaded = true;
        });

    $scope.selectedIndex = null;
    $scope.selected = [];
    $scope.routes = [];
    $scope.selectMap = selectMap;
    $scope.toggleSidenav = toggleSidenav;
    $scope.renderMap = renderMap;
    $scope.route;
    $scope.show = false;
    $scope.drivers;
    $scope.printDrivers;
    $scope.filters = ["Todos", 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    $scope.selectedFilter = "Todos";
    loadMaps();

    $scope.selectFilter = function (filter) {

    }

    $scope.selectDriver = function (driver) {
        routeService.loadRoutes(driver.id)
            .then(function (routes) {
                $scope.routes = routes;
            });
    }

    function loadMaps() {
        routeService.loadDrivers()
            .then(function (drivers) {
                $scope.drivers = drivers;
            })
    }

    function toggleSidenav(name) {
        $mdSidenav(name).toggle();
    }

    function renderMap(gpx) {
        $scope.show = false;

        route.eachLayer(function (layer) {
            if (!layer.scene) {
                route.removeLayer(layer);
            }
        });

        var leafgpx = new L.GPX(gpx, {
            async: true,
            marker_options: {
                startIconUrl: '/js/dependencies/leaflet-gpx-master/pin-icon-start.png',
                endIconUrl: '/js/dependencies/leaflet-gpx-master/pin-icon-end.png',
                shadowUrl: '/js/dependencies/leaflet-gpx-master/pin-shadow.png',
                wptIconUrls: {
                    '': '/js/dependencies/leaflet-gpx-master/pin-icon-wpt.png',
                }

            },
        }).on('loaded', function (e) {
            var gpx = e.target;
            route.fitBounds(gpx.getBounds());
            $scope.selected.distancia = (e.target.get_distance() / 1000).toFixed(2);
            $scope.selected.tempo = e.target.get_total_time() == 0 ? e.target.get_total_time().toFixed(2) : "Não estimado";
            $scope.selected.valor = (e.target.get_distance() / 1000 * precoKM).toFixed(2);
        }).addTo(route);
        $scope.show = true;
    }

    function selectMap(index) {
        $scope.selectedIndex = index;
        $scope.toggleSidenav('left');
        $scope.renderMap($scope.routes.gpx[index]);
    }

    function printLoaded(r) {
        /*
        .filter((m, i) => {
            return m.startList

        })
         */
        $scope.printDrivers = r.map(function (p) {
            if (p.empty) {
                p.infoList = p.gpx.map(function (m) {
                    var infos = { distancia: 0, valor: 0 };
                    var tempGPX = new L.GPX(m, { async: false });
                    infos.distancia = (tempGPX.get_distance() / 1000).toFixed(2);
                    infos.valor = (infos.distancia * precoKM).toFixed(2);
                    return infos;
                });
                p.totalValue = p.infoList.reduce(
                    function (a, b) {
                        return Math.round(100 * (parseFloat(b.valor) + parseFloat(a))) / 100
                            , 0
                    });
                p.totalDistance = p.infoList.reduce(
                    function (a, b) {
                        return Math.round(100 * (parseFloat(b.distancia) + parseFloat(a))) / 100
                            , 0
                    });
                return p;
            }
            return { name: p.name, empty: true };
        });
        renderPrint = true;
    }

    $scope.print = function () {
        $scope.$evalAsync(function () {
            return routeService.loadReports()
                .then(function (r) {
                    return printLoaded(r)
                });
        });

        $scope.$watch("printDrivers", function (value) {
            if (value && renderPrint) {
                $timeout(function () {
                    if (renderPrint) {
                        window.print();
                        renderPrint = false;
                        $scope.printDrivers = null;
                    }
                }, 500);
            }
        });
    }
}])

app.service('routeService', ['$q', '$http', function ($q, $http) {
    return {
        loadDrivers: function () {
            return $q.when($http
                .get('/driver')
                .then(function (o) { return o.data })
            );
        },
        loadRoutes: function (driverId) {
            return $q.when(
                $http
                    .get('/trackaction/getGpxRoutesByDriver/' + driverId)
                    .then(function (o) { return o.data })
            );
        },
        loadReports: function () {
            return $q.when(
                $http
                    .get('/trackaction/getReportData/')
                    .then(function (o) { return o.data })
            );
        }
    };
}]);