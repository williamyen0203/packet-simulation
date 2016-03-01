var

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
  initializeArrays();
  simulate();

  // initialize graph data
  var data = {
    labels: getIntervals(),
    datasets: [
      {
        label: "Busy slots",
        fillColor: "rgba(55, 86, 167, 0.2)",
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
        strokeColor: "rgba(55, 186, 167, 1)",
        pointColor: "rgba(55, 186, 167, 1)",
        pointStrokeColor: "white",
        pointHighlightFill: "white",
        pointHighlightStroke: "rgba(55, 186, 167, 1)",
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
  var timesToRun = 10;
  // run timesToRun simulations to get average
  for (var i = 0; i < timesToRun; i++) {
    // simulate for each probability, from p = 0 to p = 1, in steps of 0.02
    for (var j = 0; j <= 50; j += 1) {
      var numArrival = 0;
      // determine if packet arrives at certain slot
      for (var slot = 1; slot <= 10; slot++) {
        if (Math.random() < (j / 50)) {
          numArrival++;
        }
      }

      // push values onto array
      var numBusy = (numArrival <= 3) ? numArrival : 3;
      busySlots[j] += numBusy;
      var numDropped = (numArrival >= 3) ? numArrival - 3 : 0;
      droppedPackets[j] += numDropped;
    }
  }

  // average out number of busy slots and dropped packets
  for (var i = 0; i < busySlots.length; i++) {
    busySlots[i] /= timesToRun;
    droppedPackets[i] /= timesToRun;
  }
}

var getIntervals = function() {
  var array = [];
  for (var i = 0; i <= 100; i += 2) {
    array.push(i / 100);
  }
  return array;
}

var initializeArrays = function() {
  for (var i = 0; i <= 50; i++) {
    busySlots.push(0);
    droppedPackets.push(0);
  }
}
