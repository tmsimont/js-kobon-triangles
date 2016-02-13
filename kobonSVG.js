/**
 * SVG View class for Kobon triangle generator output.
 * @param {string} containerId the DOM ID for the element to use
 *  as the container for the SVG drawing
 */
function KobonSVG(containerId) {
  var gmax_x,
  gmax_y,
  gmin_x,
  gmin_y;

  var SVG = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvas: {},
    createCanvas: function(width, height) {
      var container = document.getElementById(containerId);
      SVG.canvas = document.createElementNS(
                              'http://www.w3.org/2000/svg', 'svg');
      SVG.canvas.setAttribute('width', width);
      SVG.canvas.setAttribute('height', height);
      container.appendChild(SVG.canvas);
      SVG.canvasWidth = width;
      SVG.canvasHeight = height;
      return SVG.canvas;
    },
    createLine: function(x1, y1, x2, y2) {
      var aLine = document.createElementNS(
                              'http://www.w3.org/2000/svg', 'line');
      aLine.setAttribute('x1', x1 + SVG.canvasWidth - gmax_x);
      aLine.setAttribute('y1', y1 + SVG.canvasHeight - gmax_y);
      aLine.setAttribute('x2', x2 + SVG.canvasWidth - gmax_x);
      aLine.setAttribute('y2', y2 + SVG.canvasHeight - gmax_y);
      aLine.setAttribute('stroke', 'rgb(55,55,55)');
      aLine.setAttribute('stroke-width', '.2');
      return aLine;
    },
    createTriangle: function(p1, p2, p3) {
      var aLine = document.createElementNS(
                              'http://www.w3.org/2000/svg', 'polygon');
      aLine.setAttribute('points',
            (p1.x + SVG.canvasWidth - gmax_x) +
                ',' +
                (p1.y + SVG.canvasHeight - gmax_y) +
                ' ' +
                (p2.x + SVG.canvasWidth - gmax_x) +
                ',' +
                (p2.y + SVG.canvasHeight - gmax_y) +
                ' ' +
                (p3.x + SVG.canvasWidth - gmax_x) +
                ',' +
                (p3.y + SVG.canvasHeight - gmax_y)
      );
      aLine.setAttribute('stroke', 'rgb(55,55,55)');
      aLine.setAttribute('stroke-width', '.2');
      return aLine;
    },
    scale: function(width, height) {
      SVG.canvas.setAttribute('width', width);
      SVG.canvas.setAttribute('height', height);
      SVG.canvas.setAttribute('viewBox', '0 0 ' +
                                SVG.canvasWidth +
                                ' ' +
                                SVG.canvasHeight);
    }
  };

  this.drawGeneratedKobons = function(kobonizer) {
    gmax_x = 0;
    gmax_y = 0;
    gmin_x = 100000;
    gmin_y = 100000;

    var intersections = kobonizer.getIntersections();
    var lines = kobonizer.getLines();
    var kobons = kobonizer.getKobons();

    // build canvas based on most extreme x's and y's of intersections
    for (var i = 0; i < intersections.length; i++) {
      if (intersections[i].point.x > gmax_x) {
        gmax_x = intersections[i].point.x;
      }
      if (intersections[i].point.y > gmax_y) {
        gmax_y = intersections[i].point.y;
      }
      if (intersections[i].point.x < gmin_x) {
        gmin_x = intersections[i].point.x;
      }
      if (intersections[i].point.y < gmin_y) {
        gmin_y = intersections[i].point.y;
      }
    }
    var canvas = SVG.createCanvas(gmax_x - gmin_x, gmax_y - gmin_y);

    // draw line segments for each line
    for (var i = 0; i < lines.length; i++) {
      for (var j = 0; j < lines[i].segments.length; j++) {
        var lineElement = SVG.createLine(
          lines[i].segments[j].intersect1.point.x,
          lines[i].segments[j].intersect1.point.y,
          lines[i].segments[j].intersect2.point.x,
          lines[i].segments[j].intersect2.point.y
        );
        canvas.appendChild(lineElement);
      }
    }

    for (var i = 0; i < kobons.length; i++) {
      var points = kobons[i].getUniquePoints();
      var triangle = SVG.createTriangle(
        points[0],
        points[1],
        points[2]
      );
      canvas.appendChild(triangle);
    }

    SVG.scale(500, 500);
  };
}
