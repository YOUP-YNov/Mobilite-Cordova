var module = angular.module('youp.event', ['ionic']);

module.factory('EventsFactory', function(){
	var eventsFactory = {
		events : [
			{
			"Evenement_id": 971,
			"LieuEvenement_id": 603,
			"Categorie_id": 197,
			"DateEvenement": "25/09/2014",
			"TitreEvenement": "labore ut consequat",
			"MaximumParticipant": 36,
			"Statut": "Terminé",
			"Prix": 191,
			"Premium": true,
			"DateMiseEnAvant": "26/11/2014",
			"Etat_id": 619,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "609 Beadel Street, Masthope, Hawaii, 7333"
			},
			{
			"Evenement_id": 686,
			"LieuEvenement_id": 797,
			"Categorie_id": 555,
			"DateEvenement": "20/02/2014",
			"TitreEvenement": "commodo voluptate dolore",
			"MaximumParticipant": 33,
			"Statut": "Annulé",
			"Prix": 195,
			"Premium": true,
			"DateMiseEnAvant": "26/10/2014",
			"Etat_id": 443,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "427 Oceanview Avenue, Riegelwood, Ohio, 6628"
			},
			{
			"Evenement_id": 359,
			"LieuEvenement_id": 563,
			"Categorie_id": 488,
			"DateEvenement": "01/08/2014",
			"TitreEvenement": "culpa sunt veniam",
			"MaximumParticipant": 12,
			"Statut": "Terminé",
			"Prix": 165,
			"Premium": false,
			"DateMiseEnAvant": "08/08/2014",
			"Etat_id": 984,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "524 Cropsey Avenue, Cataract, Palau, 5315"
			},
			{
			"Evenement_id": 410,
			"LieuEvenement_id": 77,
			"Categorie_id": 41,
			"DateEvenement": "28/11/2014",
			"TitreEvenement": "do velit ea",
			"MaximumParticipant": 6,
			"Statut": "En cours",
			"Prix": 160,
			"Premium": false,
			"DateMiseEnAvant": "17/05/2014",
			"Etat_id": 676,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "828 Lott Place, Imperial, Michigan, 7481"
			},
			{
			"Evenement_id": 559,
			"LieuEvenement_id": 708,
			"Categorie_id": 467,
			"DateEvenement": "02/05/2014",
			"TitreEvenement": "consequat aute aute",
			"MaximumParticipant": 50,
			"Statut": "En cours",
			"Prix": 96,
			"Premium": false,
			"DateMiseEnAvant": "24/08/2014",
			"Etat_id": 416,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "324 Bainbridge Street, Canby, Indiana, 8207"
			},
			{
			"Evenement_id": 430,
			"LieuEvenement_id": 455,
			"Categorie_id": 762,
			"DateEvenement": "14/08/2014",
			"TitreEvenement": "occaecat mollit ut",
			"MaximumParticipant": 30,
			"Statut": "Terminé",
			"Prix": 182,
			"Premium": false,
			"DateMiseEnAvant": "09/10/2014",
			"Etat_id": 625,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "156 Glenwood Road, Westphalia, Kansas, 5682"
			},
			{
			"Evenement_id": 2,
			"LieuEvenement_id": 233,
			"Categorie_id": 718,
			"DateEvenement": "31/03/2014",
			"TitreEvenement": "elit minim quis",
			"MaximumParticipant": 35,
			"Statut": "En cours",
			"Prix": 193,
			"Premium": false,
			"DateMiseEnAvant": "09/07/2014",
			"Etat_id": 612,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "627 Seba Avenue, Whitestone, South Dakota, 3216"
			},
			{
			"Evenement_id": 463,
			"LieuEvenement_id": 210,
			"Categorie_id": 35,
			"DateEvenement": "19/07/2014",
			"TitreEvenement": "velit Lorem aliquip",
			"MaximumParticipant": 45,
			"Statut": "En cours",
			"Prix": 23,
			"Premium": true,
			"DateMiseEnAvant": "25/07/2014",
			"Etat_id": 767,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "582 Dunne Court, Brethren, Oklahoma, 560"
			},
			{
			"Evenement_id": 889,
			"LieuEvenement_id": 636,
			"Categorie_id": 548,
			"DateEvenement": "19/11/2014",
			"TitreEvenement": "anim voluptate laboris",
			"MaximumParticipant": 26,
			"Statut": "Ouvert",
			"Prix": 181,
			"Premium": false,
			"DateMiseEnAvant": "08/06/2014",
			"Etat_id": 929,
			"EvenementPhoto_id": "http://placehold.it/32x32",
			"Adresse": "920 Putnam Avenue, Echo, Kentucky, 7852"
			}
		],
		getEvents : function(){
			return eventsFactory.events;
		}
	}
	return eventsFactory;
});

module.controller('EventCtrl', function($scope, EventsFactory) {
});

module.controller('EventListCtrl', function($scope, EventsFactory) {
	$scope.events = EventsFactory.getEvents();
});

module.controller('EventDetailCtrl', function($scope, EventsFactory) {
});

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
			url: "/detail",
			views: {
				'eventContent' :{
					templateUrl: "templates/event/detail.html",
					controller: 'EventDetailCtrl'					
				}
			}
		})
});