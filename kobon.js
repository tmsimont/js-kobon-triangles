if (typeof require != "undefined")
	var gauss = require('./gauss');

function KobonGenerator() {
	// private vars
	var lines,
	intersections,
	kobons,
	x_space,
	b_range,
	num_lines,
	input;
	
	this.getLines = function() {
		return lines;
	}
	this.getIntersections = function() {
		return intersections;
	}
	this.getKobons = function() {
		return kobons;
	}

	// basic kobon generation
	this.kobonInit = function (xs, br, nl) {
		x_space = xs;
		b_range = br;
		num_lines = nl;
		lines = [];
		intersections = [];
		kobons = [];	
		
		kobonLines(semiRandomInput());
		return kobons.length;
	}

	// no hueristic kobon for comparison
	this.kobonCrazy = function(xs, br, nl) {
		x_space = xs;
		b_range = br;
		num_lines = nl;
		lines = [];
		intersections = [];
		kobons = [];
		
		kobonLines(totallyRandomInput());
		return kobons.length;
	}

	// loop on standard a given amount of times
	this.kobonBest = function(outOf, xs, br, nl) {
		var bestCount = kobonInit(xs, br, nl);
		var bestInput = JSON.stringify(input, null, 2);
		for (var i = 1; i < outOf; i++) {
			var t = kobonInit(xs, br, nl);
			if (t > bestCount) {
				bestInput = JSON.stringify(input, null, 2);
				bestCount = t;
			}
		}
		kobonLoad(bestInput);
		return bestCount;
	}
	
	// while loop until best outcome is found
	this.kobonBestUntil = function(xs, br, nl, score) {
		var bestCount = this.kobonInit(xs, br, nl);
		var bestInput = JSON.stringify(input, null, 2);
		while (bestCount < score) {
			var t = this.kobonInit(xs, br, nl);
			if (t > bestCount) {
				bestInput = JSON.stringify(input, null, 2);
				bestCount = t;
			}
		}
		this.kobonLoad(bestInput);
		return bestCount;
	}

	// loop on the no-hueristic generator
	this.kobonCrazyBest = function(outOf, xs, br, nl) {
		var bestCount = kobonCrazy(xs, br, nl);
		var bestInput = JSON.stringify(input, null, 2);
		for (var i = 1; i < outOf; i++) {
			var t = kobonCrazy(xs, br, nl);
			if (t > bestCount) {
				bestInput = JSON.stringify(input, null, 2);
				bestCount = t;
			}
		}
		kobonLoad(bestInput);
		return bestCount;
	}

	// load previously saved set
	this.kobonLoad = function(xbs) {
		lines = [];
		intersections = [];
		kobons = [];
		
		kobonLines(JSON.parse(xbs));
		return kobons.length;
	}

	// get random input with hueristic limit
	function semiRandomInput() {
		/*
			{x:10,b:-10},
			{x:50,b:50},
			{x:100,b:-150},
			{x:150,b:205}
		*/
		var xbs = [];
		for (var i = 1; i < num_lines; i++) {
			// don't let b's get to be too close...
			xbs.push(getXBS(xbs, i, x_space, b_range, 0));
		}
		return xbs;
	}

	this.getSaveData = function() {
		return input;
	}

	// get semi random line data
	function getXBS(haveSoFar, i, x_space, b_range, rec) {
		var minSlopeDif = .05;
		
		// get random y-intercept
		var b = Math.floor((Math.random() * b_range) + 1);
		
		// get random value for x-intercept increment from last intercept
		var xs = Math.floor((Math.random() * x_space) + 10);
		
		// enforce alternating positve and negative y-intercepts
		if (i%2 == 0) {
				b = -1 * b;
		}
		
		// get actual x-intercept by adding xs to last intercept
		var x = xs;
		if (haveSoFar.length > 0) {
			x = haveSoFar[haveSoFar.length-1].x + xs;
		}
		
		// throw out lines with close-to-parallel slopes
		var tooclose = false;
		for (var j = 0; j < haveSoFar.length; j++) {
			var m = -1 * b / x;
			var m2 = -1 * haveSoFar[j].b / haveSoFar[j].x;
			if (Math.abs(m - m2) < minSlopeDif) {
				tooclose = true;
			}
		}
		
		// try again if the slope is too close to parallel, but don't recurse too many times
		if (!tooclose || rec == 500) {		
			return {
					x:x, 
					b:b
				}
		}
		
		// keep trying until you get one that's not too close
		return getXBS(haveSoFar, i, x_space, b_range, rec+1);
	}

	// forget heuristics and get completely random lines
	function totallyRandomInput() {
		/*
			{x:10,b:-10},
			{x:50,b:50},
			{x:100,b:-150},
			{x:150,b:205}
		*/
		var xbs = [];
		for (var i = 1; i < num_lines; i++) {
			var r = Math.floor((Math.random() * b_range) + 1);
			var r2 = Math.floor((Math.random() * b_range) + 1);
			var xs = Math.floor((Math.random() * x_space) + 1);
			// still alternate + and - intercepts... maybe remove this?
			if (r2%2 == 0) {
				r = -1 * r;
			}
			xbs.push({
				x:(xs * i), 
				b:r
			});
		}
		return xbs;
	}


	/************************************************/
	/* Data Models
	/************************************************/

	// line data model (y = mx + b)
	function l(y, m, x, b) {
		this.y = y;
		this.m = m;
		this.x = x;
		this.b = b;
		this.intersections = [];
		this.segments = [];
	}

	// point data model
	function point(x, y) {
		this.x = x;
		this.y = y;
		this.equals = function(other) {
			return this.x == other.x && this.y == other.y;
		}
	}

	// line intersection data model
	function intersection(line1, line2, point) {
		this.line1 = line1;
		this.line2 = line2;
		this.point = point;
		this.segments = [];
	}

	// line segment data model
	function segment(line, intersect1, intersect2) {
		this.line = line;
		this.intersect1 = intersect1;
		this.intersect2 = intersect2;
	}

	// kobon triangle model made of 3 segments
	function kobon(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.getUniquePoints = function() {
			var points = [];
			points.push(a.intersect1.point);
			points.push(a.intersect2.point);
			if (b.intersect1.point.equals(a.intersect2.point) || b.intersect1.point.equals(a.intersect1.point)) {
				points.push(b.intersect2.point);
			} else {
				points.push(b.intersect1.point);
			}
			return points;
		}
	}


	/************************************************/
	/* Data helpers
	/************************************************/

	// is a given segment already used in a kobon triangle
	function inKobonTriangle(segment) {
		for (var i = 0; i < kobons.length; i++) {
			var points = kobons[i].getUniquePoints();
			var aIsPoint;
			var bIsPoint;
			for (var j = 0; j < points.length; j++) {
				if (segment.intersect1.point.equals(points[j]))
					aIsPoint = true;
				if (segment.intersect2.point.equals(points[j]))
					bIsPoint = true;
			}
			if(aIsPoint && bIsPoint)
				return true;
		}
		return false;
	}

	// is a kobon triangle already accounted for
	function alreadyTrackedKobon(k) {
		var kPoints = k.getUniquePoints();
		for (var i = 0; i < kobons.length; i ++) {
			var points = kobons[i].getUniquePoints();
			var aMatch, bMatch, cMatch;
			aMatch = bMatch = cMatch = false;
			for (var j = 0; j < points.length; j++) {
				if (points[j].equals(kPoints[0])) aMatch = true;
				if (points[j].equals(kPoints[1])) bMatch = true;
				if (points[j].equals(kPoints[2])) cMatch = true;
			}
			if (aMatch && bMatch && cMatch) return true;
		}
		return false;
	}

	// is a kobon triangle valid
	function validKobon(k) {
		if(alreadyTrackedKobon(k))
			return false;
		var kPoints = k.getUniquePoints();
		if (kPoints[0].equals(kPoints[1]))
			return false;
		if (kPoints[0].equals(kPoints[2]))
			return false;
		if (kPoints[1].equals(kPoints[2]))
			return false;
		return true;
	}


	/**
	 * Find triangles in given lines.
	 *
	 * xbs are pairs of input, x crossing and b crossing.
	 * should be in format {x:FLOAT, b:FLOAT}
	 */
	function kobonLines(xbs) {
		input = xbs;
		// we need n-1 given points
		var n = xbs.length + 1;
		if (n < 3) {
			console.log("We need at least 3 lines for a triangle!");
			return;
		}
		
		// we will build an array of lines from input
		lines = [];

		// base line is x axis
		lines.push(new l(0, 0, 0, 0));
		
		// push lines built from b-intersects and x-intersects
		for (var i = 0; i < xbs.length; i++) {
			var m = (-1 * xbs[i].b) / xbs[i].x;
			var line = new l(0, m, xbs[i].x, xbs[i].b);
			lines.push(line);
			
			// track intersections with base line
			var intersect = new intersection(lines[0], line, new point(xbs[i].x, 0));
			intersections.push(intersect);
			lines[0].intersections.push(intersect);
			line.intersections.push(intersect);
		}
		
		// determine intersections between all lines
		for (var i = 1; i <= n - 2; i++) {
			for (var j = 1; j <= i; j++) {		
				$A = [];
				$x = [];	
				var r1 = [-1*lines[i+1].m, 1];
				$x.push(lines[i+1].b);
				var r2 = [-1*lines[i+1-j].m, 1];
				$x.push(lines[i+1-j].b);
				$A.push(r1);
				$A.push(r2);
				$result = gauss($A, $x);
				var ip = new point($result[0], $result[1]);
				var intersect = new intersection(lines[i+1], lines[i+1-j], ip);			
				lines[i+1].intersections.push(intersect);
				lines[i+1-j].intersections.push(intersect);
				intersections.push(intersect);
			}
		}
		
		// determine line segments between intersections
		for (var i = 0; i < lines.length; i++) {
			lines[i].intersections.sort(function(a, b){return a.point.x-b.point.x});
			for (var j = 0; j < lines[i].intersections.length - 1; j++) {
				var seg = new segment(lines[i], lines[i].intersections[j], lines[i].intersections[j+1]);
				lines[i].intersections[j].segments.push(seg);
				lines[i].intersections[j+1].segments.push(seg);
				lines[i].segments.push(seg);
			}
		}
		
		// determine kobon triangles from segments
		for (var i = 0; i < intersections.length; i++) {
			for (var j = 0; j < intersections[i].segments.length - 1; j++) {
				for (var k = 1 + j; k < intersections[i].segments.length; k++) {
					var segmentA = intersections[i].segments[j];
					var segmentB = intersections[i].segments[k];
					
					// NOTE: this forces a "perfect" arrangment in which no segment can be part of 2 triangles
					//if (inKobonTriangle(segmentA) || inKobonTriangle(segmentB))
					//	continue;
					
					// get other intersect on segment A
					var intersectA = segmentA.intersect1;
					if (intersectA.point.equals(intersections[i].point))
						intersectA = segmentA.intersect2;
					
					// get other intersect on segment B
					var intersectB = segmentB.intersect1;
					if (intersectB.point.equals(intersections[i].point))
						intersectB = segmentB.intersect2;
					
					// search for common segment in A and B
					for (var x = 0; x < intersectA.segments.length; x++) {
						//if (inKobonTriangle(intersectA.segments[x])) continue;
						if (
							intersectA.segments[x].intersect1.point.equals(intersectB.point)
							|| intersectA.segments[x].intersect2.point.equals(intersectB.point)
						) {
							var k = new kobon(segmentA, segmentB, intersectA.segments[x]);
							if (validKobon(k))
								kobons.push(k);
						}
					}
					
				}
			}
		}

	}
}


if (typeof module != "undefined")
	module.exports = KobonGenerator;
