'use strict';

// App name and list of dependencies
var module = angular.module('youp', ['ionic', 'youp.global', 'youp.profile', 'youp.event']);

// Init ionic
module.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

// Routes
module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.event', {
            url: "/event",
            views: {
                'menuContent' :{
                    templateUrl: "templates/event.html",
                    controller: 'EventCtrl'
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            views: {
                'menuContent' :{
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/event');
});

