var module = angular.module('youp.global', ['ionic', 'youp.profile', 'youp.event']);

module.controller('SideMenuCtrl', function($scope, $state, LoginService, EventsFactory) {

    $scope.profileLinks      = [];

    $scope.friendsLink      = {name: 'Profile',     state: 'logged.friends'};
    $scope.connectionLink   = {name: 'Connection',  state: 'notLogged.login'};
    $scope.logoutLink       = {name: 'Logout',      state: 'logout'};

    $scope.onLoginStatusChanged = function() {
        if (LoginService.isLogged()) {
            $scope.profileLinks = [
                $scope.friendsLink,
                $scope.logoutLink
            ];
        } else {
            $scope.profileLinks = [ $scope.connectionLink ];
        }
    };

    $scope.onLoginStatusChanged();

    LoginService.addLoginStatusChanged($scope.onLoginStatusChanged);

});
