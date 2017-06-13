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
	
	socket.on('users', function(data){
		
		$scope.$apply(function(){
			$scope.users =[]
			$scope.online_friends = []
			for(var i in data)
			{
				if(i != $scope.user)
				{
					if($scope.allfriends.includes(i))
					{
						$scope.online_friends.push(i)
					}
					else{
						$scope.users.push(i)
					}
				}
			}	
		})
		
	})
	
    $scope.confirm=function(){
		var data = {
			"friend_handle": $scope.friend,
			"my_handle": $scope.user
		}
		 
	  $http({method: 'POST', url: 'http://'+url+'/friend_request',data})	 
		.success(function(data){
			console.log('request accepted',data)
		})
		.error(function(error){
			console.log('error')
		})
	}

    $scope.showConfirm = function(data) {
		var confirm = $mdDialog.confirm()
		.title("Friend Request")
		.textContent(data.my_handle+ 'wants to connect. please confirm ?')
		.ariaLable('Lucky day')
		.ok('ok')
		.cancle('No')
		
		$mdDialog.show(confirm).then(function(){
			data['confirm'] = "Yes"
			$http({method: 'POST',url: 'http://'+url+'/friend_request/confirmed', data})
		
	}, function(){
		data['confirm'] = "No"
		$http({method: 'POST',url:'http://'+url+'/friend_request/confirmed', data})
	})	
	
   }
   
   $scope.on('message',function(data){
	   $scope.showConfirm(data);
   })
   
   




])

