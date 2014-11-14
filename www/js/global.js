var module = angular.module('youp.global', ['ionic', 'youp.profile']);

module.controller('SideMenuCtrl', function($scope, $state, LoginService) {

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

module.controller('DrawerCtrl', ['$element', '$attrs', '$ionicGesture', '$document', function($element, $attr, $ionicGesture, $document) {

    var el              = $element[0];
    var dragging        = false;
    var startX, lastX, offsetX, newX;
    var side;
    var isOpen          = false;

    var thresholdX      = 15;   // How far to drag before triggering
    var edgeX           = 40;   // How far from edge before triggering

    var LEFT            = 0;
    var RIGHT           = 1;

    var isTargetDrag    = false;

    var width           = $element[0].clientWidth;

    var enableAnimation = function() {
        $element.addClass('animate');
    };
    var disableAnimation = function() {
        $element.removeClass('animate');
    };

    // Check if this is on target or not
    var isTarget = function(el) {
        while(el) {
            if(el === $element[0]) {
                return true;
            }
            el = el.parentNode;
        }
    };

    var startDrag = function(e) {
        disableAnimation();

        dragging = true;
        offsetX = lastX - startX;
    };

    var startTargetDrag = function(e) {
        disableAnimation();

        dragging = true;
        isTargetDrag = true;
        offsetX = lastX - startX;
    };

    var doEndDrag = function(e) {
        startX = null;
        lastX = null;
        offsetX = null;
        isTargetDrag = false;

        if(!dragging) {
            return;
        }

        dragging = false;

        enableAnimation();

        ionic.requestAnimationFrame(function() {
            if(newX < (-width / 2)) {
                el.style.transform = el.style.webkitTransform = 'translate3d(' + -width + 'px, 0, 0)';
                isOpen = false;
            } else {
                el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
                isOpen = true;
            }
        });
    };

    var doDrag = function(e) {
        if(e.defaultPrevented) {
            return;
        }

        if(isOpen) {
            e.preventDefault();
        }

        if(!lastX) {
            startX = e.gesture.touches[0].pageX;
        }

        lastX = e.gesture.touches[0].pageX;

        if(!dragging) {

            // Dragged 15 pixels and finger is by edge
            if(Math.abs(lastX - startX) > thresholdX && isCorrectDirection()) {
                if(isOpen) {
                    startTargetDrag(e);
                } else if(startX < edgeX) {
                    startDrag(e);
                } 
            }
        } else {
            newX = Math.min(0, (-width + (lastX - offsetX)));
            ionic.requestAnimationFrame(function() {
                el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
            });

        }

        if(dragging) {
            e.gesture.srcEvent.preventDefault();
        }
    };

    var isCorrectDirection = function() {
        if((side == LEFT && !isOpen) || (side == RIGHT && isOpen)) {
            return (lastX > startX);
        } else {
            return (lastX < startX);
        }
    };

    side = $attr.side == 'left' ? LEFT : RIGHT;

    $ionicGesture.on('drag', function(e) {
        doDrag(e);
    }, $document);
    $ionicGesture.on('dragend', function(e) {
        doEndDrag(e);
    }, $document);


    this.close = function() {
        enableAnimation();
        ionic.requestAnimationFrame(function() {
            if(side === LEFT) {
                el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
            } else {
                el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
            }
            isOpen = false;
        });
    };

    this.open = function() {
        enableAnimation();
        ionic.requestAnimationFrame(function() {
            if(side === LEFT) {
                el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
            } else {
                el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
            }
            isOpen = true;
        });
    };

    this.toggle = function() {
        if(isOpen) {
            this.close();
        } else {
            this.open();
        }
    };

}]);

module.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {

    return {
        restrict: 'E',
        controller: 'DrawerCtrl',
        link: function($scope, $element, $attr, ctrl) {
            $element.addClass($attr.side);
            $scope.openDrawer = function() {
                ctrl.open();
            };
            $scope.closeDrawer = function() {
                ctrl.close();
            };
            $scope.toggleDrawer = function() {
                ctrl.toggle();
            };
        }
    };

}]);
