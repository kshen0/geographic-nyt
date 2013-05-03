import jsonfiles
import json
import sys

def main(year):
	locs_and_articles = jsonfiles.read('../json/output/geocoded_locs_%s.json' % year)
	coords = {} 
	for loc in locs_and_articles:
		lat = locs_and_articles[loc]['lat']
		lon = locs_and_articles[loc]['lon']
		name = loc
		coords[loc] = {'lat': lat, 'lon': lon, 'name': name}

	jsonfiles.write('../json/output/place_to_coord_mappings_%s.json' % year, coords)

if __name__ == '__main__':
	if len(sys.argv) != 2:
		print "invalid args"
		sys.exit(1)
	main(sys.argv[1])