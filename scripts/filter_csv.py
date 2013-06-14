import csv
import jsonfiles

with open('../json/population_2010.csv', 'rb') as f:
	countries = {}
	lines = []
	for row in csv.reader(f):
		if '2010' in row and 'High variant' in row:
			val = row[3]
			val = int(val.replace('.', ''))

			countries[row[0]] = val

	jsonfiles.write('../json/output/country_populations_2010.json',
	 				countries)
