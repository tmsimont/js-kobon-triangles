##usage
Either load to DOM and use kobonSVG.js to visualize, or use node.js and nkobon.js file.

When using node, you pass how many lines to use and how many triangles to wait for. 

For example: 
```
 node nkobon 7 11
```

This will generate 11 triangles with 7 lines. The output is a JSON string that can be loaded with `kobonLoad`

If you put an impossible amount of triangles, you'll be waiting forever.

For a complete write-up and working example of SVG, [see my blog](http://www.trevorsimonton.com/cs/projects/2015/12/10/kobon-triangle-generator-javascript.html).
