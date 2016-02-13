// kobonizer is global so you can grab output from
// console with JSON.stringify(kobonizer.getSaveData())
var kobonizer;

$(document).ready(function() {

  /**************************************************/
  /*  No UI Slider implementation for params
  /**************************************************/
  var slider_numlines = document.getElementById('slider_numlines');
  var slider_brange = document.getElementById('slider_brange');
  var slider_xspace = document.getElementById('slider_xspace');

  noUiSlider.create(slider_numlines, {
    start: 7,
    step: 1,
    connect: 'lower',
    range: {
      'min': 0,
      'max': 20
    }
  });
  slider_numlines.noUiSlider.on('update', function(values, handle) {
    $('#value_numlines').html(values[handle]);
  });

  noUiSlider.create(slider_brange, {
    start: 180,
    step: 10,
    connect: 'lower',
    range: {
      'min': 50,
      'max': 200
    }
  });
  slider_brange.noUiSlider.on('update', function(values, handle) {
    $('#value_brange').html(values[handle]);
  });

  noUiSlider.create(slider_xspace, {
    start: 20,
    step: 10,
    connect: 'lower',
    range: {
      'min': 0,
      'max': 200
    }
  });
  slider_xspace.noUiSlider.on('update', function(values, handle) {
    $('#value_xspace').html(values[handle]);
  });


  /**************************************************/
  /*  Kobon view and controller implementations
  /**************************************************/
  var kobonSVG = new KobonSVG('container');
  kobonizer = new KobonGenerator();

  // wire up DOM controls to kobon view/controller instances
  $('a#go').click(function() {
    $('#container').remove();
    $('#wrapper').append("<div id='container'></div>");
    var numkobons =
      kobonizer.kobonInit(
        parseInt($('#value_xspace').text().trim()),
        parseInt($('#value_brange').text().trim()),
        parseInt($('#value_numlines').text().trim())
      );
    $('#result').text(numkobons + ' Kobon triangles');
    kobonSVG.drawGeneratedKobons(kobonizer);
  });


  // show nice pre-saved output on load
  $('#wrapper').append("<div id='container'></div>");
  $('#result').text(11 + ' Kobon triangles');

  kobonizer.kobonLoad(JSON.stringify(
      [{'x': 21,
        'b': 121},
        {'x': 46, 'b': -33},
        {'x': 77, 'b': 160},
        {'x': 99, 'b': -190},
        {'x': 121, 'b': 111},
        {'x': 154, 'b': -69}],
      null, 2));

  kobonSVG.drawGeneratedKobons(kobonizer);

});
