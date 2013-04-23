import jsonfiles
import json
import sys

# switches lat/lon in a geojson file
# for fixing world rotated 90 degrees
def main(filename):
	jsonfile = jsonfiles.read("../json/world/" + filename)
	features = jsonfile["features"]
	new_features = []
	for feature in features:
		geo = feature["geometry"]
		one = geo["coordinates"][0]
		two = geo["coordinates"][1]
		new_geometry = {
			"type": "Point",
			"coordinates": [
				two,
				one
			]
		}

		article = feature["properties"]["article"]
		new_article = {
			"date": article["date"],
			"url": article["url"],
			"title": article["title"],
			"nytd_geo_facet": article["nytd_geo_facet"],
		}
		new_name = feature["properties"]["name"]

		new_feature = {
			"geometry": new_geometry,
			"type": "Feature",
			"properties": {
				"article": new_article,
				"name": new_name
			}
		}
		new_features.append(new_feature)

	new_fname = "../json/world/" + filename[:filename.index(".")] + "_fixed.json"
	jsonfiles.write_min(new_fname, {"type": "FeatureCollection", "features": new_features})

if __name__ == "__main__":
	if len(sys.argv) != 2:
		print "Wrong args " + str(sys.argv)
		sys.exit()
	main(sys.argv[1])
