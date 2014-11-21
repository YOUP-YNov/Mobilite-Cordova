// AngularJS module name and list of dependencies
var module = angular.module('youp.event', ['ionic', 'ngResource']);

// Services
module.factory('EventsFactory', function($resource){
	return $resource(BASE_URL.event + 'api/Evenement/:id', null, {
		'query': {method: 'GET', params: {date_search: '@dateSearch', id_Categorie: '@idCategorie', premium: '@premium', max_result: '@maxResult', max_id: '@maxId', text_search: '@textSearch', orderby: '@orderBy', startRange: '@stateRange', endRange: '@endRange'}, isArray: true}
	});
});

// Controllers
module.controller('EventCtrl', function($scope){
});

module.controller('EventListCtrl', function($scope, EventsFactory){
	$scope.events = {};
	$scope.refreshEvents = function() {
    	EventsFactory.query().$promise.then(function(result) {
			$scope.events = result;
			$scope.$broadcast('scroll.refreshComplete');
		});
    };
    $scope.loadMore = function() {
    	var eventsNumber = $scope.events.length;    	
    	EventsFactory.query({"max_result":eventsNumber + 10}).$promise.then(function(result) {
			$scope.events = result;
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	});
    };
    $scope.$on('$stateChangeSuccess', function() {
    	$scope.loadMore();
    });
});

module.controller('EventCardCtrl', function($scope, EventsFactory, $stateParams) {	
	$scope.event = {};
	EventsFactory.query().$promise.then(function(result) {
		angular.forEach(result, function(value, key){
			if(value.Evenement_id == $stateParams.id){
				$scope.event = value;
			}
		})
	});	
	$scope.goToProfilOrganizer = function() {
        // TODO : Rediriger vers le profil de l'organisateur
    };
    $scope.subscribeToEvent = function() {
    	// TODO : S'inscrire à l'évènement seulement si on est loggé
    }
    $scope.shareEvent = function() {
    	// TODO : Envoyer un mail avec les informations correspondantes
    }
});

module.controller('EventCommentCtrl', function($scope, EventsFactory, $stateParams){
	$scope.event = {};
	EventsFactory.query().$promise.then(function(result) {
		angular.forEach(result, function(value, key){
			if(value.Evenement_id == $stateParams.id){
				$scope.event = value;
			}
		})
	});
});

// Routes
module.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('app.event.list', {
			url: "/list",
			views: {
				'eventContent' :{
					templateUrl: "templates/event/list.html",
					controller: 'EventListCtrl'
				}
			}
		})
		.state('app.event.detail', {
			url: "",
			abstract: true,
			views: {
				'eventContent' :{
					templateUrl: "templates/event/detail.html",					
				}
			}
		})
		.state('app.event.detail.card', {
			url: "/card/:id",
			views: {
				'cardContent' :{
					templateUrl: "templates/event/card.html",
					controller: 'EventCardCtrl'					
				}
			}
		})
		.state('app.event.detail.comment', {
			url: "/comment/:id",
			views: {
				'commentContent' :{
					templateUrl: "templates/event/comment.html",
					controller: 'EventCommentCtrl'					
				}
			}
		})
});