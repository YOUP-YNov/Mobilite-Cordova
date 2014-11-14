var module = angular.module('youp.profile', ['ionic', 'ngResource']);

module.controller('ProfileCtrl', function($scope, LoginService) {
});

module.controller('FriendsCtrl', function($scope, LoginService) {
});

module.controller('EventsCtrl', function($scope, LoginService) {
});

module.controller('LoginCtrl', function($scope, $state, $ionicPopup, LoginService) {

    $scope.loginData = {};

    $scope.doLogin = function() {
        LoginService.login($scope.loginData);
    }

    LoginService.addLoginStatusChanged(function () {
        if(LoginService.isLogged())
            $scope.loginSuccess();
    });

    LoginService.addLoginFailed(function () {
        $scope.loginFail();
    });

    $scope.loginSuccess = function() {
        
        var successPopup = $ionicPopup.show({
            title: 'Login Success',
            scope: null,
            buttons: [
                { 
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function() {
                        $state.go('app.profile.logged.friends')
                    }
                }
            ]
        });
    };

    $scope.loginFail = function() {
        
        var successPopup = $ionicPopup.alert({
            title: 'Login Fail'
        });
    };
});

module.controller('SignUpCtrl', function($scope, LoginService, SignUpService) {

    $scope.signupData = {};

    $scope.doSignUp = function() {
       SignUpService.signUp($scope.signupData);
    }

});

module.service('LoginService', function(Auth) {

    this.loginStatusChangedCallbacks = [];
    this.loginFailedCallbacks = [];

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
        if(this.isLogged())
            this.logout();

        var parent = this;

        var response = Auth.login(data).$promise.then(
            function(result) {
                if(result.Token == "") {
                    parent.onLoginFailed();
                    return;
                }

                parent.setToken(result.Token);
                parent.onLoginStatusChanged();
            },
            function(error) {
                parent.onLoginFailed();
            }
        );
    }

    this.logout = function() {
        Auth.logout({token: this.getToken()});
        this.setToken("");

        this.onLoginStatusChanged();
    }

    this.addLoginStatusChanged = function(callback) {
        this.loginStatusChangedCallbacks.push(callback);
    }

    this.addLoginFailed = function(callback) {
        this.loginFailedCallbacks.push(callback);
    }

    this.onLoginStatusChanged = function() {
        angular.forEach(this.loginStatusChangedCallbacks, function(callback){
            callback();
        });
    }
    
    this.onLoginFailed = function() {
        angular.forEach(this.loginFailedCallbacks, function(callback){
            callback();
        });
    }

});

module.service('SignUpService', function(User) {

    this.signUp = function(signUpData) {
        console.log(signUpData);
        // TODO Vérifier la data
        var response = User.create(signUpData);
        response.$promise.then(function(result) {
            console.log(result);
        });
        // TODO Checker le retour
        // TODO Si succès se connecter
    }

});

module.factory('Auth', function($resource) {
    return $resource(DEV_URL.profile + 'api/Auth', {}, {
        login:  {method:'POST',     params:{Email:'@username', Pass:'@password', Device:'Cordova'}},
        logout: {method:'DELETE',   params:{Token:'@token'}}
    });
});

module.factory('User', function($resource) {
    return $resource(DEV_URL.profile + 'api/User/:id', {}, {
        // TODO get real  id
        query:    {method:'GET',    params:{id:'@userId'}},
        create:   {method:'POST',   data:{
                        Pseudo:'@username',
                        MotDePasse:'@password',
                        Nom:'@lastname',
                        Prenom:'@firstname',
                        Sexe:'@gender',
                        AdresseMail:'@mail',
                        DateNaissance:'@birthday',
                        Ville:'@city',
                        CodePostal:'@zipcode',
                        Situation:'@sex',
                        Presentation:'@bio',
                        Metier:'@job'
                    }},
        save:     {method:'PUT',    data:{
                        Pseudo:'@username',
                        MotDePasse:'@password',
                        Nom:'@lastname',
                        Prenom:'@firstname',
                        Sexe:'@gender',
                        AdresseMail:'@',
                        DateNaissance:'@birthday',
                        Ville:'@city',
                        CodePostal:'@zipcode',
                        Situation:'@sex',
                        Presentation:'@bio',
                        Metier:'@job'
                    }}
    });
});

module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.profile.logged', {
            url: "",
            abstract: true,
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/logged.html"
                }
            }
        })
        .state('app.profile.logged.friends', {
            url: "/friends",
            views: {
                'friendsContent' :{
                    templateUrl: "templates/profile/friends.html",
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('app.profile.logged.events', {
            url: "/events",
            views: {
                'eventsContent' :{
                    templateUrl: "templates/profile/events.html",
                    controller: 'EventsCtrl'
                }
            }
        })

        .state('app.profile.notLogged', {
            url: "",
            abstract: true,
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/notLogged.html"
                }
            }
        })
        .state('app.profile.notLogged.login', {
            url: "/login",
            views: {
                'loginContent' :{
                    templateUrl: "templates/profile/login.html",
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.profile.notLogged.signup', {
            url: "/signup",
            views: {
                'signupContent' :{
                    templateUrl: "templates/profile/signup.html",
                    controller: 'SignUpCtrl'
                }
            }
        })
});
