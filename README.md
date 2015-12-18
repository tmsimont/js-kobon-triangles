##usage

### in-browser with SVG
I added a demo of the svg code in the subdirectory `/svg-demo`. You should be able to run this in any modern browser, but I've only tried Chrome.

If you get a super sweet looking triangle, you can type this into your browser's console:
```
JSON.stringify(kobonizer.getSaveData())
```

That will give you something like this:
```
[{"x":21,"b":121},{"x":46,"b":-33},{"x":77,"b":160},{"x":99,"b":-190},{"x":121,"b":111},{"x":154,"b":-69}]
```

Notice that's what I'm using to load the default triangle with the `kobonLoad()` function in the demo's script.js file:
```
	kobonizer.kobonLoad(JSON.stringify(
	[{"x":21,"b":121},{"x":46,"b":-33},{"x":77,"b":160},{"x":99,"b":-190},{"x":121,"b":111},{"x":154,"b":-69}]
	,null, 2));
	kobonSVG.drawGeneratedKobons(kobonizer);
```

You can similarly use the output from the node.js version of this to view anything cool generated from your node.js version.

### using node.js
When using node, you pass how many lines to use and how many triangles to wait for. 

For example: 
```
 node nkobon 7 11
```
This will generate 11 triangles with 7 lines. The output is a JSON string that can be loaded with `kobonLoad`

If you put an impossible amount of triangles, you'll be waiting forever.

For a complete write-up and working example of SVG, [see my blog](http://www.trevorsimonton.com/cs/projects/2015/12/10/kobon-triangle-generator-javascript.html).
