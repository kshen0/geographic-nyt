import jsonfiles

articles = jsonfiles.read('../json/output/nyt_articles_2012_filtered.json')

countries = {}
for a in articles:
	try:
		geo_facets = a['nytd_geo_facet']
	except KeyError as e:
		print e
		try:
			geo_facets = a['geo_facet']
		except KeyError as e:
			print e
			continue
	for facet in geo_facets:
		if facet not in countries:
			countries[facet] = []

		countries[facet].append[a['url']]