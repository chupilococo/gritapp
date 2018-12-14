let app = angular.module('myApp', [
  'ngRoute',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures']);

const _API='http://52.26.64.212/app/php/';

app.run(function($transform,$window, $rootScope,$http) {
  window.$transform = $transform;
  $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
		  if(localStorage.getItem("publicacion")){
			  alert('tenes publicaciones pendientes');
			  $rootScope.pendiente=JSON.parse(localStorage.getItem("publicacion"));
			  // noinspection JSUnresolvedVariable
			  $http.get(_API+"funciones.php?f=agregar&u="+$rootScope.pendiente[0].quien+"&t="+$rootScope.pendiente[0].que+"&p="+(($rootScope.pendiente[0].publico)?'si':'no'))
		  }
        });
      }, false);
});

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'modulos/inicio.html', reloadOnSearch: false});
  $routeProvider.when('/todos',              {templateUrl: 'modulos/todos.html', reloadOnSearch: false});
  $routeProvider.when('/registro',        {templateUrl: 'modulos/registro.html', reloadOnSearch: false}); 
  $routeProvider.when('/agregar',        {templateUrl: 'modulos/agregar.html', reloadOnSearch: false}); 
});
app.directive('toucharea', ['$touch', function($touch){
  
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;  
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function($rootScope, $scope, $http){
	$scope.$watch('online', function(newStatus) {});
	$http.get(_API+"funciones.php?f=comentarios")
    .then(function(response) {
        $scope.tt=angular.fromJson(response.data);
	});
	$scope.coso =function (){
	// noinspection JSUnresolvedVariable
		$http.get(_API+"funciones.php?f=agregar&u="+$scope.dameLocal.nombre+"&t="+$scope.agregar.texto+"&p="+(($scope.agregar.publico)?'si':'no'))
    .then(function(response) {
        $scope.resp= response.data;
		location.reload();
		})
	};
	
	
	$scope.newUser =function (){
	// noinspection JSUnresolvedVariable
		$http.get(_API+"funciones.php?f=newUser&u="+$scope.alta.usuario+"&p="+$scope.alta.password)
    .then(function(response) {
		$scope.alta.resp= response.data;
		})
	};
	
	$scope.comentEdit =function (a){
		$http.get(_API+"funciones.php?f=comentEdit&u="+a)
			.then(function(response) {
				$scope.resp=response.data;
				document.getElementById('edit'+a).className='ng-show';
				$scope.agregar.texto=$scope.resp.que;
			})
	};
	
	$scope.comentDel =function (a){
	$http.get(_API+"funciones.php?f=comentDel&u="+a)
    .then(function(response) {
        $scope.resp= response.data;
		})
	};

	$scope.edit=function(a){
		$scope.comentEdit(a);
		$scope.comentDel(a);
	};
	
	$scope.borrar=function(a){
		$scope.comentDel(a);
		location.reload();
	};
	
	
	
	
	$scope.alta={};
	$scope.alt=function(){
		// noinspection JSUnresolvedVariable
		if ($scope.alta.usuario===undefined){
			alert('el usuario no puede estar vacio')
		}else if($scope.alta.password===undefined){ alert('la contraseña no puede estar vacia');
			}else{
				// noinspection JSUnresolvedVariable
				$scope.newUser();
			}
		};
	$scope.agregar={};
	$scope.agregar.publicar=false;
	$scope.ag=function(){
		if ($scope.agregar.texto===undefined){
			alert('favor de ingresar texto')
		}else if($scope.dameLocal==null){alert('favor de logearse')}else if($scope.agregar.publico===undefined){
			$scope.agregar.publico=false;
			if (!$scope.online){alert('estas offline pero lo guardamos en el localStorage');
			localStorage.setItem("publicacion", '[{"quien":"'+$scope.dameLocal.nombre+'","que":"'+$scope.agregar.texto+'","publico":"'+$scope.agregar.publico+'"}]')
				}else{
			$scope.coso();
			}
		}else{
			if (!$scope.online){
				alert('estas offline pero lo guardamos en el localStorage');
				localStorage.setItem("publicacion", '[{"quien":"'+$scope.dameLocal.nombre+'","que":"'+$scope.agregar.texto+'","publico":"'+$scope.agregar.publico+'"}]');
				}else{
			$scope.coso();
			}
		}
	};
	$scope.user={};
	$scope.validarusuario =function (){
	$http.get(_API+"funciones.php?f=usuario&u="+$scope.user.nombre+"&p="+$scope.user.password)
    .then(function(response) {
        $scope.valid= (angular.fromJson(response.data) !== '');
		if($scope.valid){
			localStorage.setItem("usuario", JSON.stringify($scope.user));
			$scope.dataUser = localStorage.getItem("usuario");
			$scope.dameLocal = JSON.parse($scope.dataUser);
		}
		location.reload();
	});
	};
	
	
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

   $scope.login = function() {
    alert($scope.email);
  };
	$scope.log=false;
	$scope.dataUser = localStorage.getItem("usuario");
	$scope.log = localStorage.getItem("usaurio") != null;
	$scope.dameLocal = JSON.parse($scope.dataUser);
	$scope.logout=function(){
		localStorage.clear();
		location.reload(); 
		};
  });
		


