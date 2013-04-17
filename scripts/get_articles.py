import requests
import pprint
import json
import time

API_KEY = "4bad459fd95c368621cda11f241190e2:11:67566190" 

def main():
	fields = read_json_from_file("../json/fields.json")
	year = 2012
	results = []

	# make request once to get the number of pages in the response
	"""
	querystring = get_querystring(year, fields, 0)
	r = requests.get(querystring).json()
	results = results + r["results"]
	pages = r["total"] / 10
	"""

	# make request for remaining pages
	# write out every 1000 requests
	for p in xrange(1, pages + 1):
		print p
		querystring = get_querystring(year, fields, 0)
		r = requests.get(querystring).json()
		results = results + r["results"]

		if p % 1000 == 0:
			filename = "".join([
				"../json/nyt_articles_", 
				str(year), 
				"_",
				str(p / 1000),
				".json"])
			with open(filename, "w") as outfile:
				json.dump(results, outfile)
				print "wrote to " + filename

			# reset results
			results = []

		# sleep so we're not locked out of the API
		time.sleep(0.1)




def read_json_from_file(filename):
	f = open(filename, 'r')
	json_obj = json.load(f)
	f.close()
	return json_obj

def get_querystring(year, fields, offset):
	query_components = [
		"http://api.nytimes.com/svc/search/v1/article?",
		("format=json&query=publication_year:[%d]" % year), 
		"&fields=",
		",".join(fields),
		"&offset=%d" % offset,
		"&rank=newest",
		("&api-key=%s" % API_KEY)
	] 
	return "".join(query_components)

if __name__ == "__main__":
	main()