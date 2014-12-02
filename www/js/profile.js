var module = angular.module('youp.profile', ['ionic', 'ngResource', 'youp.event']);

module.controller('ProfileCtrl', function($scope) {
});

module.controller('LoggedCtrl', function($scope, $state, LoginService, UserService) {
	if(!'userId' in $state.params || $state.params.userId == null)
		$state.params.userId = "";

	$scope.user = {};

	$scope.isLoggedProfile = true;

	$scope.setCurrentProfile = function() {
		$scope.user = {};
		console.log($state.params);
		if('userId' in $state.params && $state.params.userId.length != 0)
			$scope.user = UserService.get($state.params.userId);
		else if(LoginService.isLogged())
			$scope.user = LoginService.getLoggedUser();

		if(LoginService.isLogged() && $scope.user.Utilisateur_Id != LoginService.getLoggedUser().Utilisateur_Id)
			$scope.showAddFriend = false;
		else
			$scope.showAddFriend = true;
	};

	LoginService.addLoginStatusChanged($scope.setCurrentProfile);

	$scope.setCurrentProfile();

	$scope.doAddFriend = function() {
	}
});

module.controller('FriendsCtrl', function($scope, $state, LoginService, Friend, $ionicPopup) {
	$scope.friendList = [];

	Friend.get({id: $scope.user.Utilisateur_Id}).$promise.then(function(result) {
		$scope.friendList = result;
	});
});

module.controller('DetailsCtrl', function($scope, $ionicLoading) {
    $ionicLoading.show({
      template: '<i class="ion-loading-a"></i>'
    });
    $scope.showIt = false;
    $scope.profil = {};
            
    $scope.profil = $scope.user;
    $scope.showIt = true;
    $ionicLoading.hide();  
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
            title: 'Vous êtes connecté',
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
            title: 'Echec de connexion'
        });
    };
});

module.controller('SignUpCtrl', function($scope, LoginService, $ionicPopup, SignUpService) {

    $scope.signupData = {};

    $scope.doSignUp = function() {
       SignUpService.signUp($scope.signupData);
    }

    SignUpService.addSignUpData(function () {
        $scope.errorData();
    });

    $scope.errorData = function() {

        var error =  SignUpService.getError()

        var errorPopup = $ionicPopup.alert({
            title: error
        });

        console.log(error);
    };

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
		UserService.getCallback(this.getUserId(), function(result) {
			if(result == undefined) {
				parent.logout();
			} else {
				if(result.Utilisateur_Id == "") {
					parent.logout();
					return;
				}

				UserService.add(result);
				parent.onLoginStatusChanged();
			}
		});
	}
});

module.service('SignUpService', function(User) {

    this.signUpDataCallbacks = [];

    var error = 'NA';

    var parent = this;

    var EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    
    this.signUp = function(signUpData) {
        // console.log(signUpData);
        // Check data
        if(!signUpData.username || !signUpData.password || !signUpData.verifpassword || !signUpData.mail) {
            error = 'Champs requis manquant';
        } else if (signUpData.username !== encodeURIComponent(signUpData.username)) {
            error = 'Le pseudo contient des caractères interdis';
        } else if (!signUpData.mail.match(EMAIL_REGEX)) {
            error = 'E-Mail invalide';
        } else if (signUpData.password !== signUpData.verifpassword) {
            error = 'Les mots de passe sont différents';
        } else {
            error = 'GOOD';
        }


        if(error == 'GOOD') {
            var response = User.create(signUpData);
            response.$promise.then(function(result) {
                console.log(result);
                // TODO Checker le retour
                // TODO Si succès se connecter
            });
        } else {
            this.onSignUpData();
        }
    }

    this.getError = function() {
        return (error);
    }

    this.addSignUpData = function(callback) {
        this.signUpDataCallbacks.push(callback);
    }

    this.onSignUpData = function() {
        angular.forEach(this.signUpDataCallbacks, function(callback){
            callback();
        });
    }

});

module.service('UserService', function(User) {
	this.userList = {};

	this.add = function(toAdd){
		if(toAdd != undefined) {
			this.userList[toAdd.Utilisateur_Id] = toAdd;
		}
	}

	this.get = function(userId) {
		if(this.userList[userId] == undefined) {
			user = User.get({id: userId});
			this.add(user);
			return user;
		}

		return this.userList[userId];
	}

	this.getCallback = function(userId, callback){
		if(this.userList[userId] == undefined) {
			var parent = this;

			User.get({id: userId}).$promise.then(function(result) {
				parent.add(result);
				callback(result);
			},
			function(error) {
				callback(undefined);
			})
		} else {
			callback(this.userList[userId]);
		}
	}
});

module.factory('Auth', function($resource) {
    return $resource(BASE_URL.profile + 'api/Auth', {}, {
        login:  {method:'POST',     params:{'Email':'@username', 'Pass':'@password', 'Device':'Cordova'}},
        logout: {method:'DELETE',   params:{Token:'@token'}}
    });
});

module.factory('User', function($resource) {
    return $resource(BASE_URL.profile + 'api/User/:id', {}, {
		get:      {method:'GET',    params:{id:'@userId'}},
        create:   {method:'POST',   data:{
                        'Pseudo':        '@username',
                        'MotDePasse':    '@password',
                        'Nom':           '@lastname',
                        'Prenom':        '@firstname',
                        'AdresseMail':   '@mail',
                        'DateNaissance': '@birthday',
                        'Ville':         '@city',
                        'CodePostal':    '@zipcode',
                    }},
        save:     {method:'PUT',    data:{
                        'Pseudo':        '@username',
                        'MotDePasse':    '@password',
                        'Nom':           '@lastname',
                        'Prenom':        '@firstname',
                        'AdresseMail':   '@mail',
                        'DateNaissance': '@birthday',
                        'Ville':         '@city',
                        'CodePostal':    '@zipcode',
                    }}
    });
});

module.factory('Friend', function($resource) {
    return $resource(BASE_URL.profile + 'api/Friend/:id', {}, {
		get:      {method:'GET',    params:{id:'@id'}, isArray: true}
    });
});

module.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.profile.logged', {
			url:      "/:userId",
            abstract: true,
            views:    {
                'profileContent': {
                    templateUrl: "templates/profile/logged.html",
					controller:  'LoggedCtrl'
                }
            }
        })
        .state('app.profile.logged.details', {
            url:   "/details",
            views: {
                'detailsContent': {
                    templateUrl: "templates/profile/details.html",
                    controller:  'DetailsCtrl' 
                }
            }
        })
        .state('app.profile.logged.friends', {
			url:   "/friends",
            views: {
                'friendsContent': {
                    templateUrl: "templates/profile/friends.html",
                    controller:  'FriendsCtrl'
                }
            }
        })
        .state('app.profile.logged.events', {
            url:   "/events",
            views: {
                'eventsContent': {
                    templateUrl: "templates/event/list.html",
                    controller:  'EventListCtrl'
                }
            }
        })

        .state('app.profile.notLogged', {
            url:      "",
            abstract: true,
            views:    {
                'profileContent': {
                    templateUrl: "templates/profile/notLogged.html"
                }
            }
        })
        .state('app.profile.notLogged.login', {
            url:   "/login",
            views: {
                'loginContent': {
                    templateUrl: "templates/profile/login.html",
                    controller:  'LoginCtrl'
                }
            }
        })
        .state('app.profile.notLogged.signup', {
            url:   "/signup",
            views: {
                'signupContent': {
                    templateUrl: "templates/profile/signup.html",
                    controller:  'SignUpCtrl'
                }
            }
        })
});
