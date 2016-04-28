'use strict';
window.app = angular.module('CTLApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // this turns off hashbang urls (/#home) 
    $locationProvider.html5Mode(true);
    // if we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});

app.controller('SendCtrl', function($scope, SendFactory){
  $scope.send = function(form){
    SendFactory.sendform(form)
  }
})

app.controller('SuccessCtrl', function($scope, SendFactory, $state){
  $scope.back = function(){
    $state.go('form')
  }
})

app.factory('SendFactory', function($http, $stateParams, $state){
  var SendFactory = {};

  SendFactory.sendform = function(form) {
    return $http.post('/message', form)
      .then(function(res) {
        $state.go('success')
      })
  }

  return SendFactory;
})

//create states
app.config(function ($stateProvider) {

  $stateProvider.state('form', {
      url: '/',
      controller: 'SendCtrl',
      templateUrl: '/form.html'
  })
  .state('success', {
    url: '/success',
    templateUrl: '/success.html',
    controller: 'SuccessCtrl'
  })
})

