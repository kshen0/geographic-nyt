import json 
import jsonfiles
import pprint

def main():
	year = 2012
	filename = "../json/nyt_articles_%s.json" % str(year)
	all_articles = jsonfiles.read(filename)
	filtered_articles = []

	for article in all_articles:
		if ("nytd_geo_facet" in article):
			new_article = {
				"date": article["date"],
				"title": article["title"].title(),
				"url": article["url"],
				"nytd_geo_facet": article["nytd_geo_facet"]
			}
			if "page_facet" in article:
				new_article["page_facet"] = article["page_facet"]

			filtered_articles.append(new_article)

	print str(len(filtered_articles)) + " articles found"

	try:
		filename = "../json/nyt_articles_" + str(year) + "_filtered.json"
		jsonfiles.write(filename, filtered_articles)
	except IOError as e:
		print e


if __name__ == "__main__":
	main()