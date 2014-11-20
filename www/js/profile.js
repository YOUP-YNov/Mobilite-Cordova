var module = angular.module('youp.profile', ['ionic', 'ngResource']);

module.controller('ProfileCtrl', function($scope) {
});

module.controller('LoggedCtrl', function($scope, $state, LoginService, UserService) {
	if(!'userId' in $state.params || $state.params.userId == null)
		$state.params.userId = "";

	$scope.currentProfile = "";

	$scope.isLoggedProfile = true;

	$scope.setCurrentProfile = function() {
		if(!LoginService.isLogged()) {
			return;
		}

		var user = {};
		console.log($state.params);
		if('userId' in $state.params && $state.params.userId.length != 0)
			user = UserService.get($state.params.userId);
		else
			user = LoginService.getLoggedUser();

		if(user != undefined)
			$scope.currentProfile = user.Pseudo;
	};

	LoginService.addLoginStatusChanged($scope.setCurrentProfile);

	$scope.setCurrentProfile();
});

module.controller('FriendsCtrl', function($scope, $state, LoginService) {
	$scope.defineFriends = [
		{name: "wildfier",		userId: 0},
		{name: "Fluttershy",	userId: 1},
		{name: "Derpy",			userId: 2},
		{name: "Luna",			userId: 3}
	];

	$scope.friendList = [];

	angular.forEach($scope.defineFriends, function(friend) {
		if( $state.params.userId.length == 0 ||
			($state.params.userId.length != 0
			 && friend.userId != $state.params.userId)
		) {
			$scope.friendList.push(friend);
		}
	});
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
                        $state.go('app.profile.logged.friends');
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

module.controller('LogoutCtrl', function($scope, LoginService) {
    LoginService.logout();
});

module.controller('SignUpCtrl', function($scope, LoginService, SignUpService) {

    $scope.signupData = {};

    $scope.doSignUp = function() {
       SignUpService.signUp($scope.signupData);
    }

});

module.service('LoginService', function(Auth, User, UserService) {

    this.loginStatusChangedCallbacks = [];
    this.loginFailedCallbacks = [];

    this.getToken = function() {
        return window.localStorage['token'];
    }

    this.setToken = function(token) {
        window.localStorage['token'] = token;
    }

    this.getUserId = function() {
        return window.localStorage['userId'];
    }

    this.setUserId = function(userId) {
        window.localStorage['userId'] = userId;
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
				if(result.Token == "" || result.Utilisateur_Id == undefined || result.Utilisateur_Id == "") {
                    parent.onLoginFailed();
                    return;
                }

                parent.setToken(result.Token);
				parent.setUserId(result.Utilisateur_Id);
				UserService.add(result);
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
        this.setUserId("");

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

	this.getLoggedUser = function() {
		return UserService.get(this.getUserId());
	}

	if(this.isLogged()) {
        var parent = this;
		User.get(this.getUserId()).$promise.then(
			function(result) {
				if(result.Utilisateur_Id == "") {
					parent.logout();
					return;
				}

				UserService.add(result);
				parent.onLoginStatusChanged();
			},
			function(error) {
				parent.logout();
			}
		);
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

module.service('UserService', function(User) {
	this.userList = {};

	this.add = function(toAdd){
		this.userList[toAdd.Utilisateur_Id] = toAdd;
	}

	this.get = function(userId){
		return this.userList[userId];
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
        get:      {method:'GET',    params:{id:'@userId'}},
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
			url: "/:userId",
            abstract: true,
            views: {
                'profileContent' :{
                    templateUrl: "templates/profile/logged.html",
					controller: 'LoggedCtrl'
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
