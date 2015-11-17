'use strict';

var app = angular.module('app',['ngRoute']);
var map;

app.config(function($routeProvider,$locationProvider){
    $routeProvider
        .when('/list',{
            templateUrl: 'views/list.html'
        })
        .when('/search',{
            templateUrl: 'views/search.html',
            controller: 'searchController'
        })
        .when('/about',{
            templateUrl: 'views/about.html'
        });
});

app.controller('searchController',['$scope',function($scope){
    $scope.source = {};
    $scope.dest = {};

    //buat get posisi yang ingin dicari
    var startMarker;
    var endMarker;

    $scope.selectSource = function(){
        initMarker(startMarker);
    };

    $scope.selectDest = function(){
        initMarker(endMarker);
    };

    $scope.queryResult = function(){
        //call api with parameter start marker position and end marker position.
        //TODO impl
    };

    function initMarker(marker){
        if (marker === undefined){
            marker = new google.maps.Marker({
                position: map.getCenter(),
                draggable: true
            });
        }
        map.setCenter(marker.getPosition());
        marker.setMap(map);
        marker.infoWindow = new google.maps.InfoWindow({
            content: 'Tarik marker untuk mengubah lokasi'
        });
        marker.infoWindow.open(map,marker);
        marker.addListener('drag',function(){
            this.infoWindow.close();
        });
    }
}]);

app.factory('revGeoService',function(){
    var getLocationName = function(lat,lng){
        var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    infowindow.setContent(results[1].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
});

function initialize(){
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(-6.8914747,107.6084704),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);