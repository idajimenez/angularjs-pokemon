myApp.controller("controller", function($scope, $http, $storage, UserData, $timeout, Berry) {
    // $scope.pokemons = [];
    $scope.$storage = $storage;
    $storage.set('data', UserData);
    $scope.berries = Berry;
    $scope.pokemonDetails = null;
    $scope.isLoaded = false;
    
    $storage.set('loggedInUser', null);   
    $scope.username = '';
    $scope.password = '';

    $http.get('http://pokeapi.co/api/v2/type/1/', { cache: true }).then( function(response) {
      var pokemons = response.data.pokemon.slice(0,10);
      var list = [];
      for (var i = 0; i < 10; i++) {
        $http.get(pokemons[i].pokemon.url, { cache: true }).then( function(details) {
          var pokemon = {
            name: details.data.name,
            info: details.data
          }
          list.push(pokemon)
          if (i == 10) {
            $scope.pokemons = list; 
            $storage.set('pokemons', list); 
          }
        });
      }
    });

    $scope.showPokemonDetails = function(details) {
      $scope.pokemonDetails = details;
    }

    $scope.reset = function(page) {
      $scope.pokemonDetails = null;    
      if (!$scope.isLoggedIn) {
        $scope.loginSignupMessage = null;
        $scope.username = '';
        $scope.password = ''; 
      }
    }

    $scope.updateLoggedInUser = function(data, action) {
      let users = $storage.get('data');
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == $scope.loggedInUser.username) {
          if (action == 'add') {
            users[i].pokemons.push(data);
            $scope.setSuccessMessage('Succcessfully added.');
            for (let a = 0; a < $scope.pokemons.length; a++) {   
              if ($scope.pokemons[a].name == data.name) {
                $scope.pokemons.splice(a, 1);                                  
              }
            }
            $scope.reset();            
          } else if (action == 'delete') {
            for (let p = 0; p < users[i].pokemons.length; p++) {   
              if (users[i].pokemons[p].name == data.name) {
                users[i].pokemons.splice(p, 1);         
                // $scope.reset();
                $scope.setSuccessMessage('Succcessfully deleted.');                
              }   
            }   
          } else {
            users[i].berryCount += data;
          }
          $storage.set('loggedInUser', users[i]);
          $scope.loggedInUser = users[i];          
        }
      }
      $storage.set('data', users);
    }

    $scope.setSuccessMessage = function(action) {
      $scope.successMessage = action;
      $timeout(function () {
        $scope.successMessage = null;
      }, 1500);
    }

    $scope.goTo = function(page) {
      $scope.isShow = page;
      $scope.page = page;
      $scope.reset(page);
    }

    $scope.onClickAction = function() {
      if ($scope.page == 'Log In') {
        $scope.loginUser();
      } else {
        $scope.signupUser();
      }
    }

    $scope.loginUser = function() {
      var isValid = $scope.validate();
      if (!isValid) return;

      var user = $scope.checkIfUserExist();
      if (user) {
        $scope.setLoggedInUser(user);
        return;
      } 
      $scope.loginSignupMessage = 'Login failed.';
    }

    $scope.setLoggedInUser = function(user) {
      $scope.isLoggedIn = true;
      $storage.set('loggedInUser', user);
      $scope.loggedInUser = user;
      $scope.goTo('MyPokemons');

      $scope.getPokemons();
    }

    $scope.getPokemons = function() {
      var storagePokemon = $storage.get('pokemons');
      var userPokemons = $scope.loggedInUser.pokemons;
      if (storagePokemon && userPokemons.length == 0) {
        $scope.pokemons = storagePokemon;
      } else {
        for (var a = 0; a < userPokemons.length; a++) {   
          for (var b = 0; b < storagePokemon.length; b++) {   
            if (userPokemons[a].name == storagePokemon[b].name) {
              console.log(userPokemons[a].name, storagePokemon[b].name)
              storagePokemon.splice(b, 1);                                  
            }
            if (b == storagePokemon.length) $scope.pokemon = storagePokemon;
          }
        }
      }
    }

    $scope.validate = function() {
      if (!$scope.username) {
        $scope.loginSignupMessage = 'Please input your username.';
        return false;
      } else if (!$scope.password) {
        $scope.loginSignupMessage = 'Please input your password.';
        return false;
      } 
      return true;
    }

    $scope.checkIfUserExist = function() {
      var users = $storage.get('data');
      for (var u = 0; u < users.length; u++) {
        if (users[u].username == $scope.username && users[u].password == $scope.password) {
          return users[u];
        }
        if (u == users.length) return null;
      }
    }

    $scope.signupUser = function() {
      var isValid = $scope.validate();
      if (!isValid) return;

      var user = $scope.checkIfUserExist();      
      if (user) {
        $scope.loginSignupMessage = 'User already exist. Please login.';        
      } else {
        var newUser = {
          "username": $scope.username,
          "password": $scope.password,
          "pokemons": [],
          "is_admin": false,
          "berryCount": 0
        }
        var users = $storage.get('data');
        users.push(newUser);
        $storage.set('data', users);
        $scope.setLoggedInUser(newUser);
      }
    }

    $scope.logout = function() {
      $scope.isLoggedIn = null;
      $scope.isLoginShow = null;
      $storage.set('loggedInUser', null);
    }

    // Helpers
    $scope.toUpperCase = function(string) {
      return (string) ? string.charAt(0).toUpperCase() + string.slice(1) : null;
    }

    $scope.replace = function(string, char) {
      return $scope.toUpperCase(string.replace(char, ' '));
    }
});