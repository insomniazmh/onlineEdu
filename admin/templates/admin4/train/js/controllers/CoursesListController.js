'use strict';

MetronicApp.controller('CoursesListController', function($rootScope, $scope, $http, $timeout) {
	$scope.myInterval = 5000;
	var slides = $scope.slides = [{
		image: 'images/1.jpg',
		text: "电子商务基础"
	}, {
		image: 'images/2.jpg',
		text: "电子商务基础"
	}, {
		image: 'images/3.jpg',
		text: "电子商务基础"
	}];
	$scope.addSlide = function() {
		//	    	var newWidth = 500 + slides.length;
		slides.push({
			image: '',
			text: '电子商务基础'
		});
	};
	
	var slides2 = $scope.slides2 = [{
		image: 'images/4.jpg',
		text: "电子商务基础"
	}, {
		image: 'images/5.jpg',
		text: "电子商务基础"
	}, {
		image: 'images/6.jpg',
		text: "电子商务基础"
	}];
	$scope.addSlide2 = function() {
		//	    	var newWidth = 500 + slides.length;
		slides2.push({
			image: '',
			text: '电子商务基础'
		});
	};

});