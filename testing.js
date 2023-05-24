var startDate1 = new Date("2021-02-20");
var x = 10;

var xAxis = [];

for (var i = 0; i < x; i++) {
  var currentDate = new Date(startDate1);
  currentDate.setDate(startDate1.getDate() + i);
  var formattedDate = formatDate(currentDate);
  xAxis.push(formattedDate);
}

console.log(xAxis); // Example: Outputs ["2021-02-20", "2021-02-21", ..., "2021-03-01"]

function formatDate(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if necessary
  var day = ("0" + date.getDate()).slice(-2); // Add leading zero if necessary
  return year + "-" + month + "-" + day;
}
