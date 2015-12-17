if (typeof require != "undefined") {
	var gauss = require('./gauss');
	var KobonGenerator = require('./kobon');
}

var args = [];
if (typeof process.argv[2] != "undefined") {
	args.push(process.argv[2]);
}

if (typeof process.argv[3] != "undefined") {
	args.push(process.argv[3]);
}

if (args.length != 2) {
	console.log("Usage: node.js nkobon [number of lines] [number of triangles]");
}

var generator = new KobonGenerator();
var numkobons = 
	generator.kobonBestUntil(
		20,
		150,
		parseInt(process.argv[2]),
		parseInt(process.argv[3])
	);


console.log(numkobons + " triangles with "+args[0]+" lines");	
console.log(JSON.stringify(generator.getLines(), null, 2));
