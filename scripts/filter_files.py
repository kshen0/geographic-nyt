import json 
import jsonfiles
import pprint
import sys
from geopy import geocoders
from geopy.geocoders.base import Geocoder, GeocoderResultError
import time

FACET = "nytd_geo_facet"

def main(year):
	# load list of all articles
	filename = "../json/output/nyt_articles_%s_all.json" % str(year)
	all_articles = jsonfiles.read(filename)

	# filter out articles with no nytd_geo_facet property
	filtered_articles = get_geotagged(all_articles) 
	
	# write out all articles with a geo_facet
	filename = "../json/output/nyt_articles_" + str(year) + "_filtered.json"
	jsonfiles.write(filename, filtered_articles)

	# get categorized dict of articles
	# {
	#    "China": [{..}, {..} ... {..}], ...
	# 	 ...
	# }
	locations = categorize(filtered_articles)

	# write out articles that have been geocoded
	jsonfiles.write("../json/output/geocoded_locs_" + str(year) + "_.json")

	# get the number of articles in each category in descending order
	# this is not necessary for writing output
	# counts = [(loc, len(locations[loc]["articles"])) for loc in locations]
	# descending = sorted(counts, key = lambda x: x[1])
	# descending.reverse()
	# pprint.pprint(descending[:300])

	# list of the countries in the world
	countries_dict = jsonfiles.read("../json/output/countries.json")

	countries_geojson = {
		"type": "FeatureCollection",
		"features": []
	}

	places_geojson = {
		"type": "FeatureCollection",
		"features": []
	}

	g = geocoders.GoogleV3()

	for loc in locations:
		for article in locations[loc]["articles"]:
			feature = get_feature(article, locations[loc])
			if not feature:
				continue
			if loc in countries_dict:
				countries_geojson["features"].append(feature)
			else:
				places_geojson["features"].append(feature)

	print ("%d article matches for countries and %d matches for places" %
			(len(countries_geojson), len(places_geojson)))

	write_output(filtered_articles, countries_geojson, places_geojson, year)

def write_output(filtered_articles, countries_geojson, places_geojson, year):
	# write to file
	try:
		# write out countries and the articles that correspond to them
		filename = "../json/output/countries_%s.json" % year
		jsonfiles.write(filename, countries_geojson)
		# write out places and the articles that correspond to them
		filename = "../json/output/places_%s.json" % year
		jsonfiles.write(filename, places_geojson)
	except IOError as e:
		print e

def get_feature(article, loc):
	try:
		return ({ 
			"type": "Feature", 
			"properties": {"article": article, "name": loc["name"]}, 
			"geometry": 
				{ 
					"type": "Point", 
					"coordinates": [loc["lon"], loc["lat"]]
				} 
		})
	except KeyError as e:
		print str(e) + " for loc:\n"
		pprint.pprint(loc)
		return None

# divide articles by their nytd_geo_facet 
def categorize(articles):
	g = geocoders.GoogleV3()
	locations = {}
	i = 0
	for article in articles:
		for geo_facet in article[FACET]:
			if geo_facet not in locations:
				# get geodata
				try:
					places = g.geocode(geo_facet, exactly_one=False)
				except GeocoderResultError as err:
					print str(err) + " for facet " + geo_facet
					continue

				# create articles list for this location
				locations[geo_facet] = {"articles": []} 

				# add the coordinates
				place = places[0]
				name = place[0]
				lat, lon = place[1][0], place[1][1]
				print "%d - %s: %.5f, %.5f" % (i, name, lat, lon)
				locations[geo_facet]["lat"] = lat
				locations[geo_facet]["lon"] = lon
				locations[geo_facet]["name"] = name

				# wait to avoid being locked out of api
				time.sleep(0.3)
				i += 1

			locations[geo_facet]["articles"].append(article)
	return locations


def get_geotagged(all_articles):
	filtered_articles = []
	for article in all_articles:
		#print "considering " + article["title"]
		if (FACET in article):
			new_article = {
				"date": article["date"],
				"title": article["title"].title(),
				"url": article["url"],
				FACET: article[FACET]
			}
			if "page_facet" in article:
				new_article["page_facet"] = article["page_facet"]

			filtered_articles.append(new_article)

	print str(len(filtered_articles)) + " articles found"

	return filtered_articles

if __name__ == "__main__":
	if len(sys.argv) != 2 or sys.argv[1] < 1980:
		print "Invalid args " + str(sys.argv[1:])
		sys.exit()

	main(sys.argv[1])