var width = 960,
    height = 1160;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("../json/world/world.json", function(error, world) {
	var subunits = topojson.object(world, world.objects.subunits);	

	var projection = d3.geo.albers()
		.center([0, 55.4])
		.rotate([4.4, 0])
		.parallels([50, 60])
		.scale(6000)
		.translate([width / 2, height / 2]);

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

	svg.append("path")
		.datum(topojson.mesh(world, world.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
		.attr("d", path)
		.attr("class", "subunit-boundary");
});