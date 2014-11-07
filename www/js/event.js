var module = angular.module('youp.event', ['ionic']);

module.controller('EventCtrl', function($scope) {
	$scope.events = [
		{
		"Evenement_id": 196,
		"LieuEvenement_id": 133,
		"Categorie_id": 524,
		"DateEvenement": "Mon May 17 1999 14:46:33 GMT+0200 (Paris, Madrid (heure d’été))",
		"TitreEvenement": "laborum exercitation tempor",
		"MaximumParticipant": 25,
		"Statut": "En cours",
		"Prix": 185,
		"Premium": false,
		"DateMiseEnAvant": "Thu Nov 11 1971 21:44:32 GMT+0100 (Paris, Madrid)",
		"Etat_id": 484,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "390 Chester Court, Westwood, Virginia, 2855"
		},
		{
		"Evenement_id": 116,
		"LieuEvenement_id": 860,
		"Categorie_id": 938,
		"DateEvenement": "Wed May 02 1984 12:15:42 GMT+0200 (Paris, Madrid (heure d’été))",
		"TitreEvenement": "Lorem adipisicing eu",
		"MaximumParticipant": 41,
		"Statut": "Terminé",
		"Prix": 91,
		"Premium": false,
		"DateMiseEnAvant": "Fri Oct 27 2006 05:17:53 GMT+0200 (Paris, Madrid (heure d’été))",
		"Etat_id": 916,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "580 Stuart Street, Brantleyville, Hawaii, 1657"
		},
		{
		"Evenement_id": 102,
		"LieuEvenement_id": 405,
		"Categorie_id": 783,
		"DateEvenement": "Tue Dec 25 1984 12:42:42 GMT+0100 (Paris, Madrid)",
		"TitreEvenement": "culpa duis aliqua",
		"MaximumParticipant": 49,
		"Statut": "En cours",
		"Prix": 167,
		"Premium": true,
		"DateMiseEnAvant": "Thu Jun 07 1979 07:57:06 GMT+0200 (Paris, Madrid (heure d’été))",
		"Etat_id": 259,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "374 Woodbine Street, Ribera, Kentucky, 7820"
		},
		{
		"Evenement_id": 657,
		"LieuEvenement_id": 142,
		"Categorie_id": 524,
		"DateEvenement": "Sat Feb 19 2005 06:51:35 GMT+0100 (Paris, Madrid)",
		"TitreEvenement": "sint minim duis",
		"MaximumParticipant": 43,
		"Statut": "Complet",
		"Prix": 56,
		"Premium": true,
		"DateMiseEnAvant": "Thu Jan 26 2012 13:11:19 GMT+0100 (Paris, Madrid)",
		"Etat_id": 577,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "381 Borinquen Pl, Gibsonia, Guam, 9830"
		},
		{
		"Evenement_id": 295,
		"LieuEvenement_id": 333,
		"Categorie_id": 758,
		"DateEvenement": "Sat Oct 20 1984 21:05:45 GMT+0200 (Paris, Madrid (heure d’été))",
		"TitreEvenement": "reprehenderit cupidatat mollit",
		"MaximumParticipant": 21,
		"Statut": "Annulé",
		"Prix": 121,
		"Premium": true,
		"DateMiseEnAvant": "Fri Jul 10 2009 18:39:53 GMT+0200 (Paris, Madrid (heure d’été))",
		"Etat_id": 32,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "573 Elm Avenue, Roy, Illinois, 7135"
		},
		{
		"Evenement_id": 137,
		"LieuEvenement_id": 709,
		"Categorie_id": 329,
		"DateEvenement": "Sun Nov 06 1994 03:32:47 GMT+0100 (Paris, Madrid)",
		"TitreEvenement": "labore tempor commodo",
		"MaximumParticipant": 12,
		"Statut": "Complet",
		"Prix": 183,
		"Premium": true,
		"DateMiseEnAvant": "Sun Jan 07 1990 12:43:29 GMT+0100 (Paris, Madrid)",
		"Etat_id": 991,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "188 Rochester Avenue, Lloyd, Arizona, 4174"
		},
		{
		"Evenement_id": 71,
		"LieuEvenement_id": 99,
		"Categorie_id": 222,
		"DateEvenement": "Wed Dec 29 2004 01:16:48 GMT+0100 (Paris, Madrid)",
		"TitreEvenement": "in anim excepteur",
		"MaximumParticipant": 17,
		"Statut": "Ouvert",
		"Prix": 1,
		"Premium": true,
		"DateMiseEnAvant": "Sun Feb 12 1995 05:13:51 GMT+0100 (Paris, Madrid)",
		"Etat_id": 304,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "705 Harway Avenue, Lynn, South Carolina, 5192"
		},
		{
		"Evenement_id": 782,
		"LieuEvenement_id": 817,
		"Categorie_id": 437,
		"DateEvenement": "Fri Dec 19 1986 23:00:42 GMT+0100 (Paris, Madrid)",
		"TitreEvenement": "et consequat esse",
		"MaximumParticipant": 3,
		"Statut": "Ouvert",
		"Prix": 61,
		"Premium": false,
		"DateMiseEnAvant": "Tue Jan 15 2002 19:43:20 GMT+0100 (Paris, Madrid)",
		"Etat_id": 734,
		"EvenementPhoto_id": "http://placehold.it/32x32",
		"Adresse": "152 Williams Avenue, Dante, New York, 8709"
		}
	];
});