var module = angular.module('youp.global', ['ionic', 'youp.profile']);

module.controller('SideMenuCtrl', function($scope, $state, LoginService) {

    $scope.profileLinks      = [];

	$scope.isLogged = LoginService.isLogged();

    $scope.friendsLink      = {name: 'Profile',     state: 'logged.friends'};
    $scope.connectionLink   = {name: 'Connection',  state: 'notLogged.login'};

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
		$state.go('app.event.list');
	};

    $scope.onLoginStatusChanged();

    LoginService.addLoginStatusChanged($scope.onLoginStatusChanged);

});
