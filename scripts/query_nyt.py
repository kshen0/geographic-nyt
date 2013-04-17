import requests
import pprint
import json

API_KEY = "01d32981db766d4ced24f3d339054fb9:11:67517747"

def main():
	topics = read_json_from_file("../json/topics.json")
	for topic in topics:
		querystring = get_querystring(topic)
		r = requests.get(querystring)
		pprint.pprint(r.json())

def read_json_from_file(filename):
	f = open(filename, 'r')
	json_obj = json.load(f)
	f.close()
	return json_obj

def get_querystring(topic):
	YEAR = "2013"
	fields = [
		"body", 
		"byline", 
		"date", 
		"title", 
		"url", 
		"page_facet", 
		"desk_facet", 
		"nytd_des_facet"
	]
	querystring = ("http://api.nytimes.com/svc/search/v1/" + 
		"article?format=json&query=title:%s" + 
		"+publication_year:[%s]" + 
		"&fields=" + ",".join(fields) +
		"&api-key=%s") % (topic, YEAR, API_KEY)
	return querystring

if __name__ == "__main__":
	main()