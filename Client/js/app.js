var app = angular.module('myApp',['ngMaterial','ui.router','ngStorage'])

app.factory('socket',function(){
	var socket = io.connect()
	return(
	   on: function(eventName, callback){
		   socket.on(eventName, callback)
	   },
	   
	   emit: function(eventName,data){
		   socket.emit(eventName,data)
	   }   
	)
	
})

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/')
	
	$stateProvider
	.state('login',{
		url: '/',
		views:{
			'body': {
				templateUrl: '/Client/login.html', 
				controller: 'registerController' 
			}
			
		}
		
		
	})
	
	.state('loggedin',{
	   url:	'/login',
	   views: {
		   'body': {
			   templateUrl: '/Client/chat.html',
			   controller: 'myController'
		   }
	   }
	})
}])

app.directive('myEnter',function(){
	return function(scope,element,attres)
	{
		element.bind('keydown keypress',function(event)
		{
			if(event.which === 13)
			{
				scope.$apply(function(){
					scope.$eval(attres.myEnter)
				})
				event.preventDefault()
			}
		})
	}
})

app.controller('mycontroller',['$scope','socket','$http','$mdDialog','$compile','$location','$state','$localStorage','$sessionStorage',function($scope,socket,$http,$mdDialog,$compile,$location,$state,$localStorage,$sessionStorage)
{
	url = location.host
	$scope.user=[]
	$scope.online_friends=[]
	$scope.allfriends=[]
	$scope.messages={}
	var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October","November", "December"];
	
	socket.on('handle',function(data){
		$scope.user = data
	})
	
	socket.on('friend_list',function(data){
		$scope.$apply(function(){
		   $scope.allfriends.push.apply($scope.allfriends,data)	
		})
	})
	
	socket.on('users',function(data){
		$scope.$apply(function()
		{
			
		})
	})
}
])

