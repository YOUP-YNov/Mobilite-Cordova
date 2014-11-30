// AngularJS module name and list of dependencies
var module = angular.module('youp.event', ['ionic', 'ngResource', 'youp.profile']);

// Services
module.factory('EventsFactory', function($resource){
	return $resource(BASE_URL.event + 'api/Evenement/:id', null, {
		'query': {
			method: 'GET', 
			params: {
				date_search: '@dateSearch', 
				id_Categorie: '@idCategorie', 
				premium: '@premium', 
				max_result: '@maxResult', 
				max_id: '@maxId', 
				text_search: '@textSearch', 
				orderby: '@orderBy',	 
				startRange: '@stateRange', 
				endRange: '@endRange'
			}, 
			isArray: true
		},
		'get': {
			method: 'GET', 
			params: {
				id: '@id'
			}
		}
	});
});

module.factory('CommentsFactory', function($resource){
	return $resource('http://forumyoup.apphb.com/api/MessageTopic/:IDTopic', null, {
		'query': {
			method: 'GET', 
			params: {
				IDTopic: '@IDTopic'
			},
			isArray: true
		}
	});
});

// Controllers
module.controller('EventCtrl', function($scope){
});

module.controller('EventListCtrl', function($scope, EventsFactory){	
	$scope.events = {};
	$scope.haveResult = true;
	$scope.refreshEvents = function() {
		$scope.haveResult = true;
    	EventsFactory.query().$promise.then(function(result) {
			$scope.events = result;
			console.log(result);
			$scope.$broadcast('scroll.refreshComplete');
			if ($scope.events.length == 0){
				$scope.haveResult = false;
			}
		}, function(error) {
			console.log(error);
		});
    };
   //  $scope.loadMore = function() {
   //  	var eventsNumber = $scope.events.length;
   //  	console.log($scope.events.length);
   //  	EventsFactory.query({"max_result":eventsNumber + 10}).$promise.then(function(result) {
			// $scope.events = result;
			// console.log(result);
   //  		$scope.$broadcast('scroll.infiniteScrollComplete');
   //  		if ($scope.events.length == 0){
			// 	$scope.haveResult = false;
			// }
   //  	}, function(error) {
   //  		console.log(error);
   //  	});
   //  };
   //  $scope.$on('$stateChangeSuccess', function() {
   //  	$scope.loadMore();
   //  });
});

module.controller('EventCardCtrl', function($scope, $state, EventsFactory, LoginService, $stateParams) {	
	$scope.event = {};
	$scope.showDetails = false;
	var evenement = EventsFactory.get({id: $stateParams.id}, function(value, responseHeaders){
		console.log(value);
		console.log(responseHeaders);
		$scope.event = evenement;
		$scope.showDetails = true;
	}, function(httpResponse){
		console.log(httpResponse);
	});
	$scope.goToProfilOrganizer = function(id) {
		$state.go('app.profile.logged.friends', {userId: id});
    };
    $scope.subscribeToEvent = function() {
    	// TODO : S'inscrire à l'évènement seulement si on est loggé
    	if (LoginService.isLogged()){
    		EventsFactory.subscribe({"id":$stateParams.id,"idProfil":LoginService.getUserId()}).$promise.then(function(result) {
    			console.log(result);
    		}, function(error) {
    			console.log(error);
    		});
    	}
    	else {
    		alert ('NOT LOGGED');
    	}
    }
    $scope.shareEvent = function() {
    	// TODO : Envoyer un mail avec les informations correspondantes
    }
});

module.controller('EventCommentCtrl', function($scope, CommentsFactory, $stateParams){
	$scope.comments = {};
	CommentsFactory.query({'IDTopic': '121'}).$promise.then(function(result) {
		console.log(result);
		angular.forEach(result, function(value, key){
			if(value.Topic_id == '121'){
				$scope.comments = value;
			}
		})
	}, function(error) {
		console.log(error);
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