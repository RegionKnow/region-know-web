angular.module('appFilters', []).filter('dateParser', function() {
  return function(input) {
    console.log("Inside filter", input);
    return input.toLocaleString();
  };
});
