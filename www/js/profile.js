var module = angular.module('youp.profile', ['ionic']);

module.controller('ProfileCtrl', function($scope, LoginService) {
});

module.controller('FriendsCtrl', function($scope, LoginService) {
});

module.controller('LoginCtrl', function($scope, $state, LoginService) {

    $scope.loginData = {};

    $scope.doLogin = function() {
        LoginService.login($scope.loginData);
        $state.go('^.friends');
    }

});

module.controller('LogoutCtrl', function($scope, LoginService) {
    LoginService.logout();
});

module.controller('SignUpCtrl', function($scope, LoginService) {
});

module.service('LoginService', function() {

    this.loginStatusChangedCallbacks = [];

    this.getToken = function() {
        return window.localStorage['token'];
    }

    this.setToken = function(token) {
        window.localStorage['token'] = token;
    }

    this.isLogged = function() {
        return (this.getToken() != "");
    }

    this.login = function(data) {
        // TODO API CALL
        // TODO SAVE TOKEN
        if(this.isLogged())
            this.logout();

        this.setToken(42);

        this.onLoginStatusChanged();
    }

    this.logout = function() {
        // TODO API CALL
        this.setToken("");

        this.onLoginStatusChanged();
    }

    this.addLoginStatusChanged = function(callback) {
        this.loginStatusChangedCallbacks.push(callback);
    }

    this.onLoginStatusChanged = function() {
        angular.forEach(this.loginStatusChangedCallbacks, function(callback){
            callback();
        });
    }
});

module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.profile.friends', {
            url: "/friends",
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/friends.html",
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('app.profile.login', {
            url: "/login",
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/login.html",
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.profile.logout', {
            url: "/logout",
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/logout.html",
                    controller: 'LogoutCtrl'
                }
            }
        })
});
