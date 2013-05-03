var width = 754,
    height = 700;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var proj = "mercator";

d3.json("../json/world/world.json", function(error, world) {
	// Load country landmass data
	var subunits = topojson.object(world, world.objects.subunits);	

	// Choose a projection
	var projection = null;
	if (proj == "mercator") {
		projection = d3.geo.mercator()
			.scale(120)
			.translate([width/2, height/2]);
	}
	else if (proj == "orthographic") {
		projection = d3.geo.orthographic()
			.scale(300);
	}
	else {
		alert("Choose a projection");
	}

	// Adjust projection

	// Draw the world landmass
	var path = d3.geo.path()
		.projection(projection);

	svg.append("path")
		.datum(subunits)
		.attr("d", path);

	svg.selectAll(".subunit")
		.data(topojson.object(world, world.objects.subunits).geometries)
		.enter().append("path")
		.attr("class", function(d) { return "subunit " + d.id; })
		.attr("d", path);

	// Set dot size
	path.pointRadius(3);

	// Draw dots for countries
	var circle = d3.geo.circle();
	console.log(circle);
	svg.append("path")
		.datum(topojson.object(world, world.objects.countries_2012))
		.attr("d", path)
		.attr("class", "place");
	/*
	var points = world.objects.countries_2012.geometries;
	for (var i = 0; i < 5; i ++) {
		console.log(points[i]);
	}
	*/
	svg.selectAll("path")
		.data(topojson.object(world, world.objects.countries_2012.geometries))
	  .enter().append("path")
	  	.attr("d", d3.geo.path())
	  	.attr("class", "place");

	d3.selectAll(".place")
		.attr("fill-opacity", 0.1);

	// Set dot size
	/*
	path.pointRadius(1.2);
	// Draw dots for other places
	svg.append("path")
		.datum(topojson.object(world, world.objects.places_2012))
		.attr("d", path)
		.attr("class", "place");
	*/


	// Adjust for some weird projection bug 
	// Mercator only :(
	/*
	if (proj == "mercator") {
		d3.selectAll(".place")
			.attr("fill-opacity", 0.6)
			.attr("transform", "translate(6, 2)");
	}
	*/
	/*
	svg.append("path")
		.datum(topojson.mesh(world, world.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
		.attr("d", path)
		.attr("class", "subunit-boundary");
	*/
});