var module = angular.module('youp.global', ['ionic', 'youp.profile']);

module.controller('SideMenuCtrl', function($scope, $state, $ionicPopup, LoginService) {

    $scope.profileLinks      = [];

	$scope.isLogged = LoginService.isLogged();

    $scope.friendsLink      = {name: 'Profil',     state: 'logged.friends'};
    $scope.connectionLink   = {name: 'Connexion',  state: 'notLogged.login'};

    $scope.onLoginStatusChanged = function() {
        if (LoginService.isLogged()) {
			$scope.isLogged = true;
            $scope.profileLinks = [ $scope.friendsLink ];
        } else {
			$scope.isLogged = false;
            $scope.profileLinks = [ $scope.connectionLink ];
        }
    };

	$scope.doLogout = function() {
		LoginService.logout();
        $scope.logoutPopup();
		$state.go('app.event.list');
	};

    $scope.logoutPopup = function() {
        var logoutPopup = $ionicPopup.alert({
            title: 'Logout Success'
        });
    };

    $scope.onLoginStatusChanged();

    LoginService.addLoginStatusChanged($scope.onLoginStatusChanged);

});
