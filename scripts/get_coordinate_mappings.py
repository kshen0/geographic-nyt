import jsonfiles
import json

locs_and_articles = jsonfiles.read('../json/output/geocoded_locs_2012.json')
coords = {} 
for loc in locs_and_articles:
	lat = locs_and_articles[loc]['lat']
	lon = locs_and_articles[loc]['lon']
	name = loc
	coords[loc] = {'lat': lat, 'lon': lon, 'name': name}

jsonfiles.write('../json/output/place_to_coord_mappings.json', coords)