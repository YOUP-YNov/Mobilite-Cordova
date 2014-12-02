// AngularJS module name and list of dependencies
var module = angular.module('youp.event', ['ionic', 'ngResource', 'youp.profile']);

// Services
module.factory('EventsFactory', function($resource){
	return $resource(BASE_URL.event + 'api/Evenement/:id', null, {
		'query': {method: 'GET', params: {date_search: '@dateSearch', id_Categorie: '@idCategorie', premium: '@premium', max_result: '@maxResult', max_id: '@maxId', text_search: '@textSearch', orderby: '@orderBy', startRange: '@stateRange', endRange: '@endRange'}, isArray: true},
		'subscribe': {method: 'POST', params:  {id_evenement: '@id_evenement', token: '@token'}, url: BASE_URL.event + 'api/Evenement/:id_evenement/Inscription'},
		'unsubscribe': {method: 'POST', params:  {id_evenement: '@id_evenement', token: '@token'}, url: BASE_URL.event + 'api/Evenement/:id_evenement/Desinscription'},
		'get': {method: 'GET', params: {id: '@id'}},
		'getByUser': {method: 'GET', params: {id: '@id'}, url: BASE_URL.event + 'api/Profil/:id/Evenements', isArray: true}
	});
});

module.factory('CommentsFactory', function($resource){
	return $resource('http://forumyoup.apphb.com/api/MessageTopic/:IDTopic', null, {
		'query': {method: 'GET', params: {IDTopic: '@IDTopic'}, isArray: true}
	});
});

// Controllers
module.controller('EventCtrl', function($scope){
});

module.controller('EventListCtrl', function($scope, $state, EventsFactory, LoginService){

	if($state.params.userId != undefined) {
		if($state.params.userId != "") {
			$scope.idUser = $state.params.userId;
		} else {
			$scope.idUser = LoginService.getUserId();
		}
	}

	$scope.events = {};
	$scope.haveResult = true;
	$scope.refreshEvents = function() {
		var query;

		if($scope.idUser != undefined) {
			query = EventsFactory.getByUser({id: $scope.idUser});
		} else {
			query = EventsFactory.query();
		}

		query.$promise.then(function(result) {
			$scope.events = result;
			console.log(result);
			$scope.$broadcast('scroll.refreshComplete');
		}, function(error) {
			console.log(error);
		});
    };

    $scope.refreshEvents();

  //   $scope.loadMore = function() {
		// var query;
		// if($scope.idUser != undefined) {
		// 	query = EventsFactory.getByUser({id: $scope.idUser});
		// } else {
		// 	var eventsNumber = $scope.events.length;
		// 	console.log($scope.events.length);
		// 	query = EventsFactory.query({"max_result":eventsNumber + 10});
		// }

		// query.$promise.then(function(result) {
		// 	$scope.events = result;
		// 	$scope.$broadcast('scroll.infiniteScrollComplete');
		// }, function(error) {
		// 	console.log(error);
		// });
  //   };
    
  //   $scope.$on('$stateChangeSuccess', function() {
  //   	$scope.loadMore();
  //   });
});

module.controller('EventCardCtrl', function($scope, $state, $ionicPopup, EventsFactory, LoginService, $stateParams) {	
	$scope.event = {};
	$scope.showDetails = false;
	$scope.showSubscribeButton = LoginService.isLogged();
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
    	if (LoginService.isLogged()){
    		var isRegistered = false;
    		angular.forEach ($scope.event.Participants, function(value, key) {
				if (value.UtilisateurId == LoginService.getUserId()) {
					isRegistered = true;
				};
			});
			if (isRegistered) {
				$ionicPopup.alert({
        			title: 'Inscription impossible',
        			template: 'Vous êtes déjà inscrit à cet événement'
        		});
			}
			else {
				EventsFactory.subscribe({"id_evenement":$scope.event.Evenement_id,"token":LoginService.getToken()}).$promise.then(function(result) {
	    			$ionicPopup.alert({
	        			title: 'Inscription réussie',
	        			template: 'Vous êtes désormais inscrit à cet événement. Soyez à l\'heure !'
        			});        			
	    		}, function(error) {
	    			$ionicPopup.alert({
	        			title: 'Echec de l\'inscription',
	        			template: error
        			});
	    		});
			}    		
    	}
    	else {
    		$ionicPopup.confirm({
    			title: 'Inscription impossible',
    			template: 'Vous devez d\'abord être connecté. Voulez-vous vous connecter ?',
    			buttons: [{
					text: 'Non',
					type: 'button-default'
				}, 
				{
					text: 'Oui',
					type: 'button-positive',
					onTap: function(e) {						
						return true;
					}
				}]
			}).then(function(res) {
				if(res) {
					$state.go('app.profile.notLogged.login');
				}
			});
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