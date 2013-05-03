var width = 754,
    height = 700;

/*
var width = 960,
    height = 500;
*/

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var proj = "orthographic";


queue()
	.defer(d3.json, "/json/world/world.json")
	.defer(d3.json, "/json/output/countries_2012_v3.json")
	.defer(d3.json, "/json/output/places_2012_lite.json")
	.await(loadingDone);

function loadingDone(error, world, countries, places) {
	// Choose a projection
	var projection = null;
	if (proj == "mercator") {
		projection = d3.geo.mercator()
			.scale(120)
			.translate([width/2, height/2]);
	}
	else if (proj == "orthographic") {
		projection = d3.geo.orthographic()
			.scale(300)
			.translate([width / 2, height / 2])
			.clipAngle(90);
	}
	else {
		alert("Choose a projection");
	}

	var path = d3.geo.path()
				.projection(projection);

	// Define a function to get radius
	var radius = d3.scale.sqrt()
	    .domain([0, 1e6])
	    .range([0, 10]);

	// Draw countries of the world
	/*
	svg.append("path")
		.attr("class", "subunit")
		.datum(topojson.object(world, world.objects.subunits))
		.attr("d", path);
	*/

	// Draw dots for countries
	svg.selectAll(".country-dot")
		.data(countries.features)
	.enter().append("path")
		.attr("class", "country-dot")
		.attr("d", path.pointRadius(function(d) {
			//console.log(d);
			return 4;	
		}));

	// Draw dots for other places
	svg.selectAll(".place-dot")
		.data(places.features)
	.enter().append("path")
		.attr("class", "place-dot")
		.attr("d", path.pointRadius(1));
		// todo: define opacity or radius by num articles

	// Enable rotation
	var λ = d3.scale.linear()
	    .domain([0, width])
	    .range([-180, 180]);

	var φ = d3.scale.linear()
	    .domain([0, height])
	    .range([90, -90]);

	svg.on("mousemove", function() {
	  var p = d3.mouse(this);
	  projection.rotate([λ(p[0]), φ(p[1])]);
	  svg.selectAll("path").attr("d", path);
	});
};
