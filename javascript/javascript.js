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

  // initialize graph data
  var data = {
    labels: getIntervals(),
    datasets: [
      {
        label: "Busy slots",
        fillColor: "rgba(55, 186, 167, 0.2)",
        strokeColor: "rgba(55, 86, 167, 1)",
        pointColor: "rgba(55, 86, 167, 1)",
        pointStrokeColor: "white",
        pointHighlightFill: "white",
        pointHighlightStroke: "rgba(55, 86, 167, 1)",
        data: busySlots
      },
      {
        label: "Dropped packets",
        fillColor: "rgba(55, 186, 167, 0.2)",
        strokeColor: "rgba(55, 86, 167, 1)",
        pointColor: "rgba(55, 86, 167, 1)",
        pointStrokeColor: "white",
        pointHighlightFill: "white",
        pointHighlightStroke: "rgba(55, 86, 167, 1)",
        data: droppedPackets
      }
    ]
  };

  var options = {
    responsive: true,
    multiTooltipTemplate: "<%= value + ' packets' %>"
  };

  // create busy graph
  var ctx = $("#busy-graph").get(0).getContext("2d");
  var busyChart = new Chart(ctx).Line(data, options);
});

var simulate = function() {
  for (var i = 0.02; i <= 1; i += 0.02) {
    var numArrival = 0;
    var numBusy = 0;
    var numDropped = 0;
    for (var slot = 1; slot <= 10; slot++) {
      if (Math.random() < i) {
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

var getIntervals = function() {
  var array = [];
  for (var i = 2; i < 100; i += 2) {
    array.push(i / 100);
  }
  console.log(array);
  return array;
}
