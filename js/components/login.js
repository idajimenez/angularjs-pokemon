angular.module('pokemon').component('login', {
  template: '<div class="form">' +
            '<h3>Login Page</h3>' +
            '<form>' +
            '<label for="uname">Username</label>' +
            '<input type="text" id="uname" name="username" placeholder="Your username..">' +

            '<label for="password">Password</label>' +
            '<input type="text" id="password" name="password" placeholder="Your password..">' +

            '<input type="submit" value="Submit" ng-click="login()">' +
            '</form>' +
            '</div>',
           
  // controller: function() {
  //   this.greeting = 'hello';
  
  //   this.toggleGreeting = function() {
  //     this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
  //   }
  // }
})