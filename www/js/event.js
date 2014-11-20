// AngularJS module name and list of dependencies
var module = angular.module('youp.event', ['ionic', 'ngResource']);

// Services
module.factory('EventsFactory', function($resource){
	return $resource(BASE_URL.event + 'api/Evenement', null, {
		'query': {method: 'GET', params: {date_search: '@dateSearch', id_Categorie: '@idCategorie', premium: '@premium', max_result: '@maxResult', max_id: '@maxId', text_search: '@textSearch', orderby: '@orderBy', startRange: '@stateRange', endRange: '@endRange'}, isArray: true}
	});
});

// Controllers
module.controller('EventCtrl', function($scope){
});

module.controller('EventListCtrl', function($scope, EventsFactory){
	$scope.events = {};
	EventsFactory.query().$promise.then(function(result) {
		$scope.events = result;
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
});

module.controller('EventCommentCtrl', function($scope, EventsFactory){	
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
			url: "/comment",
			views: {
				'commentContent' :{
					templateUrl: "templates/event/comment.html",
					controller: 'EventCommentCtrl'					
				}
			}
		})
});