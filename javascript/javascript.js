var canvas_html = '<canvas id="graph" class="graph"></canvas><div class="chart-legend"></div>';
var timesToRunDefault = 10;
var inputsDefault = 3;
var outputsDefault = 10;

var busySlots = [];                     // array to hold busy slots
var droppedPackets = [];                // array to hold dropped packetse
var timesToRun = timesToRunDefault;     // number of times to run simulation
var inputs = inputsDefault;             // number of input slots
var outputs = outputsDefault;           // number of output slots

$(document).ready(function() {
  // create simulation slider
  $("#simulation-slider").slider({
    range: "min",
    value: timesToRunDefault,
    max: 99,
    slide: function(event, ui) {
      $("#simulation-slider-label").html(ui.value + 1 + " simulations");
      timesToRun = ui.value + 1;
    }
  });
  $("#simulation-slider-label").html($("#simulation-slider").slider("value") + " simulations");

  // create input slider
  $("#input-slider").slider({
    range: "min",
    value: inputsDefault,
    max: 99,
    slide: function(event, ui) {
      $("#input-slider-label").html(ui.value + 1 + " inputs");
      inputs = ui.value + 1;
    }
  });
  $("#input-slider-label").html($("#input-slider").slider("value") + " inputs");

  // create output slider
  $("#output-slider").slider({
    range: "min",
    value: outputsDefault,
    max: 99,
    slide: function(event, ui) {
      $("#output-slider-label").html(ui.value + 1 + " outputs");
      outputs = ui.value + 1;
    }
  });
  $("#output-slider-label").html($("#output-slider").slider("value") + " outputs");

  // attach listener to rerun simulations button
  $(".rerun-button").click(function() {
    initializeArrays();
    simulate();
    initCanvas();
  })

  // attach listener to reset defaults button
  $(".defaults-button").click(function() {
    $("#simulation-slider").slider("value", timesToRunDefault);
    $("#simulation-slider-label").html(timesToRunDefault + " simulations");
    timesToRun = timesToRunDefault;

    $("#input-slider").slider("value", inputsDefault);
    $("#input-slider-label").html(inputsDefault + " inputs");
    inputs = inputsDefault;

    $("#output-slider").slider("value", outputsDefault);
    $("#output-slider-label").html(outputsDefault + " outputs");
    outputs = outputsDefault;
  })

  // make sure at least one checkbox is checked
  $('input:checkbox').change(function() {
    if ($(".checkbox input:checked").length == 0) {
      $(this).prop('checked', true);
      $(".select-one-error").show();
    } else {
      $(".select-one-error").hide();
    }
  })

  // run simulation
  initializeArrays();
  simulate();
  initCanvas();

});

var initCanvas = function() {
  $(".canvas-container").html(canvas_html);
  // determine which lines to show
  var datasetsObj = [];
  if ($("#busy-toggle").is(':checked')) {
    datasetsObj.push({
      label: "Busy slots",
      fillColor: "rgba(55, 86, 167, 0.2)",
      strokeColor: "rgba(55, 86, 167, 1)",
      pointColor: "rgba(55, 86, 167, 1)",
      pointStrokeColor: "white",
      pointHighlightFill: "white",
      pointHighlightStroke: "rgba(55, 86, 167, 1)",
      data: busySlots
    });
  }
  if ($("#dropped-toggle").is(':checked')) {
    datasetsObj.push({
      label: "Dropped packets",
      fillColor: "rgba(55, 186, 167, 0.2)",
      strokeColor: "rgba(55, 186, 167, 1)",
      pointColor: "rgba(55, 186, 167, 1)",
      pointStrokeColor: "white",
      pointHighlightFill: "white",
      pointHighlightStroke: "rgba(55, 186, 167, 1)",
      data: droppedPackets
    });
  }

  // initialize graph data
  var data = {
    labels: getIntervals(),
    datasets: datasetsObj
  };

  // graph options
  var options = {
    responsive: true,
    multiTooltipTemplate: "<%= value + ' packets' %>"
  };

  // create graph
  var ctx = $("#graph").get(0).getContext("2d");
  var chart = new Chart(ctx).Line(data, options);

  // generate legend
  $(".chart-legend").html(chart.generateLegend());
}

var simulate = function() {
  // run timesToRun simulations to get average
  for (var i = 0; i < timesToRun; i++) {
    // simulate for each probability, from p = 0 to p = 1, in steps of 0.02
    for (var j = 0; j <= 50; j += 1) {
      var numArrival = 0;
      // determine if packet arrives at certain slot
      for (var slot = 1; slot <= outputs; slot++) {
        if (Math.random() < (j / 50)) {
          numArrival++;
        }
      }

      // push values onto array
      var numBusy = (numArrival <= inputs) ? numArrival : inputs;
      busySlots[j] += numBusy;
      var numDropped = (numArrival >= inputs) ? numArrival - inputs : 0;
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
  busySlots = [];
  droppedPackets = [];
  for (var i = 0; i <= 50; i++) {
    busySlots.push(0);
    droppedPackets.push(0);
  }
}
