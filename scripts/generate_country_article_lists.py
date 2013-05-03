import jsonfiles

articles = jsonfiles.read('../json/output/nyt_articles_2012_filtered.json')

countries = {}
for a in articles:
	geo_facets = a['nytd_geo_facet']
	for facet in geo_facets:
		if facet not in countries:
			countries[facet] = []

		countries[facet].append[a['url']]