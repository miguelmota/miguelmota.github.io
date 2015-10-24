//var array = [3,-2,0,4,6,-5];
//var array = [1,0,0,1];
var array = [ 2, -1, 1, -1, 1];
var balancePoints = [];
var beforeSum = 0;
var afterSum = 0;

for (var i = 0; i < array.length; i++) {

 if (i > 0) {
     beforeSum += array[i-1];
 }

 if (i <= array.length) {
    afterSum = array.slice(i+1, array.length).reduce(function(a, v) {
     return a + v;
 }, 0);
 }

 if (beforeSum === afterSum) {
     balancePoints.push(i);
 }


}

console.log(balancePoints);




  function sum(a, b) {
    return a + b;
  }

  function balancePoints(array) {
    if (!Array.isArray(array)) {
      return [];
    }

    var totalSum = array.reduce(sum, 0);
    var leftSum = 0;

    return array.reduce(function(points, current, i) {
      if (i > 0) {
        leftSum += array[i-1];
      }

      var rightSum = totalSum - leftSum - current;

      if (leftSum === rightSum) {
        points.push(i);
      }

      return points;
    }, []);
  }
