var width = 960,
	height = 1160;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

// Render the map
d3.json("../json/map_data/world2.json", function(error, world) {
	// Convert TopoJSON to GeoJSON
	var subunits = topojson.object(world, world.objects.subunits);

	// Define the projection
	var projection = d3.geo.mercator()
	//var projection = d3.geo.orthographic()
		.scale(150)
		.translate([width/2, height/2]);

	// Define path generator
	var path = d3.geo.path()
		.projection(projection);

	// Define path element, bind to generator
	/*
	svg.append("path")
		.datum(subunits)
		.attr("d", path);
		*/

	// Set dot size
	path.pointRadius(1);

	// Draw dots for cities
	svg.append("path")
		.datum(topojson.object(world, world.objects.places))
		.attr("d", path)
		.attr("class", "place");

	d3.selectAll(".place").each(function(d, i) {
		d3.select(this).style("fill-opacity", Math.random());
	});

});