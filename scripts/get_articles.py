import requests
import pprint
import json
import jsonfiles
import time
import sys

API_KEY = "01d32981db766d4ced24f3d339054fb9:11:67517747" 

def main(year_str):
	fields = jsonfiles.read("../json/fields.json")
	year = int(year_str) 
	print 'Getting articles for the year ' + str(year)
	results = []

	# make request once to get the number of pages in the response
	querystring = get_querystring(year, fields, 0)
	r = requests.get(querystring).json()
	results = results + r["results"]
	pages = r["total"] / 10

	# make request for remaining pages
	# write out every 1000 requests
	i = 1
	last_start = 1 
	for p in xrange(last_start, pages + 1):
		# try until request succeeds
		while True:
			try:
				querystring = get_querystring(year, fields, p)
				r = requests.get(querystring).json()
				results = results + r["results"]
				print ("request #%d - first title: %s") % (p, r["results"][0]["title"])
			except ValueError as e:
				print e
				print "retrying ..."
				time.sleep(1.0)
				continue
			except KeyError as e:
				print e
				print 'Skipping ', str(p)
			break

		if p % 1000 == 0:
			print "set of 1000 - first title is:\n%s" % results[0]["title"]
			filename = "".join([
				"../json/output/nyt_articles_", 
				str(year), 
				"_",
				str(i),
				".json"])
			jsonfiles.write(filename, results)
			i += 1

			# reset results
			results = []

		# sleep so we're not locked out of the API
		time.sleep(0.08)

	# write remaining results
	filename = "".join([
		"../json/output/nyt_articles_", 
		str(year), 
		"_",
		str(i),
		".json"])
	jsonfiles.write(filename, results)

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
	if len(sys.argv) != 2:
		print "Invalid args " + str(sys.argv[1:])
		sys.exit(1)
	main(sys.argv[1])