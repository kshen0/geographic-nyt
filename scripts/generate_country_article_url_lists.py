import jsonfiles

articles = jsonfiles.read('../json/output/nyt_articles_2012_filtered.json')
country_list = jsonfiles.read('../json/output/countries.json')

countries = {}
for a in articles:
	geo_facets = a['nytd_geo_facet']
	for facet in geo_facets:
		if facet not in country_list:
			continue
		if facet not in countries:
			countries[facet] = {'articles': [], 'article_count': 0}

		countries[facet]['articles'].append(a['url'])
		countries[facet]['article_count'] += 1

jsonfiles.write('../json/output/articles_by_country.json', countries)