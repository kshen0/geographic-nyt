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

var moveable = false;
var articlesByCountry = null;
d3.json("/json/output/articles_by_country.json", function(e, json) {
	if (e) return console.warn(e);
	articlesByCountry = json;
});


queue()
	.defer(d3.json, "/json/world/subunits_litest_topo.json")
	.defer(d3.json, "/json/output/countries_2012_v3.json")
	.defer(d3.json, "/json/output/places_2012_lite.json")
	.await(loadingDone);

function loadingDone(error, world, countries, places, freq) {
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

	var opacityScale = d3.scale.sqrt()
	    .domain([0, 1500])
	    .range([0.2, 1]);

	// Draw countries of the world
	/*
	svg.append("path")
		.attr("class", "subunit")
		.datum(topojson.object(world, world.objects.subunits_litest))
		.attr("d", path);
	*/
	svg.selectAll(".subunit")
		.data(topojson.feature(world, world.objects.subunits_litest).features)
		.enter().append("path")
		.attr("class", function(d) { return "subunit " + d.id; })
		.attr("d", path)
		.attr("opacity", function(d) {
			if (d.id in articlesByCountry) {
				return opacityScale(articlesByCountry[d.id]['article_count']);
			}
			else {
				return 0.1;
			}
		})
		.on("click", function(d) {
			launchRandomUrl(d.id);
		});

	// Draw boundaries
	/*
	svg.append("path")
	    .datum(topojson.mesh(world, world.objects.subunits_litest, function(a, b) { return a !== b; }))
	    .attr("d", path)
	    .attr("class", "subunit-boundary");
	*/

	// Draw dots for countries
	/*
	svg.selectAll(".country-dot")
		.data(countries.features)
	.enter().append("path")
		.attr("class", "country-dot")
		.attr("d", path.pointRadius(1));
	*/

	// Draw dots for non-country places 
	/*
	svg.selectAll(".place-dot")
		.data(places.features)
	.enter().append("path")
		.attr("class", "place-dot")
		.attr("d", path.pointRadius(1))
		.attr("opacity", 0);
	*/

	// Enable rotation
	var λ = d3.scale.linear()
	    .domain([0, width])
	    .range([-180, 180]);

	var φ = d3.scale.linear()
	    .domain([0, height])
	    .range([90, -90]);

	    
	svg.on("mousemove", function() {
		if (moveable) {
			p = d3.mouse(this);
			projection.rotate([λ(p[0]), φ(p[1])]);
			svg.selectAll("path").attr("d", path);
		}
		/*
		var p = d3.mouse(this);
		if (m0) {
			var m1 = [p[0], p[1]],
			o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
			projection.center(o1);
		}
		*/
	});

	svg.on("mousedown", function() {
		moveable = true;

		/*
		var p = d3.mouse(this);
		m0 = [p[0], p[1]];
		o0 = projection.center();
		*/
	});

	svg.on("mouseup", function() {
		moveable = false;

		/*
		if (m0) {
			m0 = null;
		}
		*/
	});

	// Append buttons
	var button = svg.append("g");
	button.append("rect")
		  .attr("x", 20)
		  .attr("y", 20)
		  .attr("width", 81)
		  .attr("height", 25)
		  .attr("fill", "#292929");
	button.append("text")
		  .attr("dx", 25)
		  .attr("dy", 37)
		  .attr("fill", "#666666")
		  .text("BLACKOUT");

};

function launchRandomUrl(country) {
	if (!articlesByCountry) {
		return console.warn("articles not cached");
	}
	if (country in articlesByCountry) {
		var articles = articlesByCountry[country]['articles'];
		var i = Math.floor(Math.random() * articles.length);
		var url = articles[i];
		var win = window.open(url, '_blank');
	}
}
