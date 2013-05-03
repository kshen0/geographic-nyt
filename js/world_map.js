var width = 754,
    height = 700;


var svg = null;

var proj = "orthographic";
var TRANSITION_TIME = 400; // ms

var moveable = false;

// JSON
var world = null;
var countries = null;
var places = null;
var articlesByCountry = null;


/*
queue()
	.defer(d3.json, "/subunits_litest_topo.json")
	.defer(d3.json, "/countries_2012_lite.json")
	.defer(d3.json, "/places_2012_lite.json")
	.defer(d3.json, "/articles_by_country.json")
	.await(cacheJSON);
*/

/*
function cacheJSON(error, w, c, p, a) {
	if (error) {
		console.warn(error);
	}
	world = w;
	countries = c;
	places = p;
	articlesByCountry = a;

	renderMap();
};
*/
cacheJSON();

function cacheJSON() {
	$.getJSON('./js/subunits_litest_topo.json', function(json) {
		world = json;
		$.getJSON('./js/countries_2012_lite.json', function(json) {
			countries = json;
			$.getJSON('./js/places_2012_lite.json', function(json) {
				places = json;
				$.getJSON('./js/articles_by_country.json', function(json) {
					articlesByCountry = json;
						renderMap();
				});
			});
		});
	});
}


function renderMap() {
	if (!svg) {
		svg = d3.select("#svg-container").append("svg")
		    .attr("width", width)
		    .attr("height", height);
	}
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
	    .attr("class", "subunit-boundary")
	    .attr("opacity", 0);
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
	svg.selectAll(".place-dot")
		.data(places.features)
	.enter().append("path")
		.attr("class", "place-dot")
		.attr("d", path.pointRadius(1))
		.attr("opacity", 0);

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

	// Hacky fix for only part of background changing color
	svg.append("rect")
		.attr("x", -1)
		.attr("y", -1)
		.attr("width", 1)
		.attr("height", 1);
	svg.append("rect")
		.attr("x", 754)
		.attr("y", 700)
		.attr("width", 1)
		.attr("height", 1);

	// Append buttons
	var button = svg.append("g")
		.attr("id", "blackout-button")
		.on("click", function() {
			blackout();	
		});
	button.append("rect")
		  .attr("x", 76)
		  .attr("y", 20)
		  .attr("width", 81)
		  .attr("height", 25)
		  .attr("fill", "#333333");
	button.append("text")
		  .attr("dx", 81)
		  .attr("dy", 37)
		  .attr("fill", "#666666")
		  .text("BLACKOUT");

	svg.transition().style("opacity", "1.0");

};

function lightsOn() {
	// Background to light blue
	d3.select("body")
		.transition()
		.duration(TRANSITION_TIME)
		.style("background", "url(../img/textured_paper.png) repeat");

	// Header to dark grey
	d3.select("h1")
		.transition()
		.duration(TRANSITION_TIME)
		.style("color", "#141414");


	// Redraw the svg
	d3.select("svg").remove();
	svg = null;
	renderMap();
};

function blackout() {
	var dotOpacityScale = d3.scale.sqrt()
	    .domain([0, 400])
	    .range([0.3, 1]);

	d3.select("#blackout-button")
		.remove();

	// Append buttons
	var button = svg.append("g")
		.attr("id", "blackout-button")
		.on("click", function() {
			lightsOn();	
		});
	button.append("rect")
		  .attr("x", 76)
		  .attr("y", 20)
		  .attr("width", 81)
		  .attr("height", 25)
		  .attr("fill", "#273C5A");
	button.append("text")
		  .attr("dx", 81)
		  .attr("dy", 37)
		  .attr("fill", "#121D2B")
		  .text("LIGHTS ON");

	d3.selectAll(".subunit")
		.transition()
		.duration(TRANSITION_TIME)
		.style({"fill": "#1F1F1F",
				"opacity": "1.0"});

	d3.selectAll(".place-dot")
		.transition()
		.duration(TRANSITION_TIME)
		.style({"opacity": function(d) {
				return dotOpacityScale(d.properties.article_count);
			} 
		});

	// Page background to dark grey
	d3.select("body")
		.transition()
		.duration(TRANSITION_TIME)
		.style("background", "#141414");

	// Header text color to cobalt 
	d3.select("h1")
		.transition()
		.duration(TRANSITION_TIME)
		.style("color", "#273C5A");
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
