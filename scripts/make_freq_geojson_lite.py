import jsonfiles
import json
import pprint

country_freq = jsonfiles.read('../json/output/article_freq_by_country.json')
place_freq = jsonfiles.read('../json/output/article_freq_by_place.json')
articles = jsonfiles.read('../json/output/nyt_articles_2012_filtered.json')
coords = jsonfiles.read('../json/output/place_to_coord_mappings.json')

def main():

	country_geojson = {'type': 'FeatureCollection', 'features': []}
	place_geojson = {'type': 'FeatureCollection', 'features': []}
	country_features = {}
	place_features = {}
	for a in articles:
		locs = a['nytd_geo_facet']
		for loc in locs:
			if loc in country_freq:
				if loc not in country_features: 
					country_features[loc] = get_feature(loc)
				feat = country_features[loc] 
				# add article and increment article count
				feat['properties']['article_count'] += 1
			elif loc in place_freq:
				if loc not in place_features: 
					place_features[loc] = get_feature(loc)
				feat = place_features[loc] 
				# add article and increment article count
				feat['properties']['article_count'] += 1
			else:
				print "could not place " + loc

	print type(country_features)
	country_geojson['features'] = [country_features[key] for key in country_features]
	place_geojson['features'] = [place_features[key] for key in place_features]

	jsonfiles.write('../json/output/countries_2012_lite.json', country_geojson)
	jsonfiles.write('../json/output/places_2012_lite.json', place_geojson)

# gets a geojson feature for one coordinate
def get_feature(loc):
	try:
		c = coords[loc]
		return ({ 
			"type": "Feature", 
			"properties": {"article_count": 0, "name": loc}, 
			"geometry": 
				{ 
					"type": "Point", 
					# Switch lat and lon - geocoder data transposed?
					"coordinates":  [ c['lon'], c['lat'] ]
					#"coordinates": [loc["lat"], loc["lon"]]
				} 
		})
	except KeyError as e:
		print e + " for " + str(loc)

if __name__ == '__main__':
	main()
