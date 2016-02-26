var busySlots = [];
var droppedPackets = [];

$(document).ready(function() {
  // create slider
  $("#probability-slider").slider({
    range: "min",
    value: 50,
    max: 100,
    slide: function(event, ui) {
      $("#probability-slider-label").html(ui.value + " %");
    }
  });
  $("#probability-slider-label").html($("#probability-slider").slider("value") + " %");

  // run simulation
  simulate();

  // create busy graph
  var ctx = $("#busy-chart").get(0).getContext("2d");
  var busyChart = new Chart(ctx);
});

var simulate = function() {
  for (var i = 0.02; i <= 1; i += 0.02) {
    var numArrival = 0;
    var numBusy = 0;
    var numDropped = 0;
    for (var slot = 1; slot <= 10; slot++) {
      if (Math.random() <= i) {
        numArrival++
      }
    }
    numBusy = (numArrival <= 3) ? numArrival : 3;
    busySlots.push(numBusy);
    numDropped = (numArrival >= 3) ? numArrival - 3 : 0;
    droppedPackets.push(numDropped);
  }

  console.log(busySlots);
  console.log(droppedPackets);
}
