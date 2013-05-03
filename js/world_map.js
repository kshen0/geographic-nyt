var width = 754,
    height = 700;

/*
var width = 960,
    height = 500;
*/

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var proj = "mercator";

var radius = d3.scale.sqrt()
    .domain([0, 1e6])
    .range([0, 10]);

queue()
	.defer(d3.json, "/json/world/world.json")
	.defer(d3.json, "/json/output/countries_2012_v2.json")
	.defer(d3.json, "/json/output/places_2012_v2.json")
	.await(loadingDone);

function loadingDone(error, world, countries, places) {
	var projection = d3.geo.mercator()
			.scale(120)
			.translate([width/2, height/2]);

	var path = d3.geo.path()
				.projection(projection);

	// Draw countries of the world
	svg.append("path")
		.attr("class", "subunit")
		.datum(topojson.object(world, world.objects.subunits))
		.attr("d", path);

	// Draw dots for countries
	svg.selectAll(".country-dot")
		.data(countries.features)
	.enter().append("path")
		.attr("class", "country-dot")
		.attr("d", path.pointRadius(4));

	// Draw dots for other places
	svg.selectAll(".place-dot")
		.data(places.features)
	.enter().append("path")
		.attr("class", "place-dot")
		.attr("d", path.pointRadius(1));
};

if (false) {
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
	/*

	svg.append("path")
		.datum(subunits)
		.attr("d", path);

	svg.selectAll(".subunit")
		.data(topojson.object(world, world.objects.subunits).geometries)
		.enter().append("path")
		.attr("class", function(d) { return "subunit " + d.id; })
		.attr("d", path);
	*/

	// Set dot size
	path.pointRadius(3);

	// Draw dots for countries
	/*
	console.log(circle);
	svg.append("path")
		.datum(topojson.object(world, world.objects.countries_2012))
		.attr("d", path)
		.attr("class", "place");
	svg.selectAll("path")
		.data(topojson.object(world, world.objects.countries_2012.geometries))
	  .enter().append("path")
	  	.attr("d", d3.geo.path())
	  	.attr("class", "place");
  	*/

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
}