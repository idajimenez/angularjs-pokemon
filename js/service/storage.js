myApp.service('$storage', function($window, ){
  
  return {
    get: function(key){
      var value = $window.localStorage[key];
      return value ? JSON.parse(value): null;
    },
    set: function(key, value){
      $window.localStorage[key] = JSON.stringify(value);
    },
    remove: function(key){
      $window.localStorage.removeItem(key);
    }
  }
});