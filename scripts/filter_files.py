import json 
import jsonfiles
import pprint
import sys
from geopy import geocoders
import time

FACET = "nytd_geo_facet"

def main(argv):
	if len(argv) != 1 or argv[0] < 1980:
		print "Invalid args " + argv
		return

	year = int(argv[0])

	# load list of all articles
	filename = "../json/output/nyt_articles_%s_all.json" % str(year)
	all_articles = jsonfiles.read(filename)
	#pprint.pprint(all_articles[:10])

	# filter out articles with no nytd_geo_facet property
	filtered_articles = get_geotagged(all_articles) 

	# get categorized dict of articles
	# {
	#    "China": [{..}, {..} ... {..}], ...
	# 	 ...
	# }
	locations = categorize(filtered_articles)

	# get the number of articles in each category in descending order
	# this is not necessary for writing output
	counts = [(loc, len(locations[loc]["articles"])) for loc in locations]
	descending = sorted(counts, key = lambda x: x[1])
	descending.reverse()
	pprint.pprint(descending[:300])

	countries_dict = jsonfiles.read("../json/output/countries.json")
	countries_output = {}
	places_output = {}

	# 3 am comments
	# hey kevin
	# geojson looks like this:
	"""
	{
		"type": "FeatureCollection",
		                                                                                
		"features": 
		[
			{ 
				"type": "Feature", 
				"properties": 
				{ 
					...
				}, 
			"geometry": 
			{ 
				"type": "Point", 
				"coordinates": 
				[ 
					-57.840002473401341, 
					-34.47999900541754 
				] 
			} 
		}
		# more features
		, {..}, {..}
		]
	}
	"""

	countries_geojson = 
	{
		"type": "FeatureCollection",
		"features": 
		[
			{ 
				"type": "Feature", 
				"properties": {}, 
				"geometry": 
					{ 
						"type": "Point", 
						"coordinates": [] 
					} 
			}
		]
	}

	# get lat, lon from google maps api
	g = geocoders.GoogleV3()
	i = 0
	for loc in locations:
		i += 1
		if i > 3:
			break 

		print "Trying %s..." % loc
		#try:
		places = g.geocode(loc, exactly_one=False)
		place = places[0]
		name = place[0]
		lat, lon = place[1][0], place[1][1]
		print "%s: %.5f, %.5f" % (name, lat, lon)
		if loc in countries_dict:
			countries_output[loc] = {}
			countries_output[loc]["articles"] = locations[loc]["articles"]
			countries_output[loc]["lat"] = lat
			countries_output[loc]["lon"] = lon
			countries_output[loc]["geocoder_name"] = name
		else:
			places_output[loc] = {}
			places_output[loc]["articles"] = locations[loc]["articles"]
			places_output[loc]["lat"] = lat
			places_output[loc]["lon"] = lon
			places_output[loc]["geocoder_name"] = name

		"""
		except Exception as e:
			print "#### Failed ####"
			print e
			continue
		"""
		time.sleep(0.3)

	# write to file
	try:
		# write out all articles with a geo_facet
		filename = "../json/output/nyt_articles_" + str(year) + "_filtered.json"
		jsonfiles.write(filename, filtered_articles)
		# write out countries and the articles that correspond to them
		filename = "../json/output/countries_%d.json" % year
		jsonfiles.write(filename, countries_output)
		# write out places and the articles that correspond to them
		filename = "../json/output/places_%d.json" % year
		jsonfiles.write(filename, places_output)
	except IOError as e:
		print e

# divide articles by their nytd_geo_facet 
def categorize(articles):
	locations = {}
	for article in articles:
		for geo_facet in article[FACET]:
			if geo_facet not in locations:
				locations[geo_facet] = {"articles": []} 
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
	main(sys.argv[1:])