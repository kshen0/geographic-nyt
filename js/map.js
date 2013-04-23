var width = 960,
	height = 1160;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

// Render the map
d3.json("../json/map_data/world2.json", function(error, world) {
//d3.json("../json/output/world_articles.json", function(error, world) {
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

	svg.selectAll(".subunit")
	    .data(topojson.object(world, world.objects.subunits).geometries)
	  .enter().append("path")
	    .attr("class", function(d) { 
	    	console.log(d);
	    	return "subunit " + d.id; })
	    .attr("d", path);

	// Set dot size
	path.pointRadius(10);

	// Draw dots for countries
	svg.append("path")
		.datum(topojson.object(world, world.objects.countries_2012))
		.attr("d", path)
		.attr("class", "place");

	d3.selectAll(".place").each(function(d, i) {
		d3.select(this).style("fill-opacity", 0.2);
	});

	// Set dot size
	path.pointRadius(1);
	// Draw dots for other places
	svg.append("path")
		.datum(topojson.object(world, world.objects.places_2012))
		.attr("d", path)
		.attr("class", "place");
	d3.selectAll(".place").each(function(d, i) {
		d3.select(this).style("fill-opacity", 0.7);
	});


});