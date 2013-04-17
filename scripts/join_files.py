import json 

def main():
	year = 2012
	segments = 9
	output = []
	for i in xrange(1, segments + 1):
		filename = "../json/nyt_articles_%s%d.json" % (str(year), i)
		print filename
		r = read_json_from_file(filename)
		output = output + r
		print len(output)

	outfile_name = "../json/nyt_articles_" + str(year) + ".json"
	with open(outfile_name, "w") as outfile:
		json.dump(output, outfile)
		print "wrote " + str(len(output)) + " entries to " + outfile_name


def read_json_from_file(filename):
	f = open(filename, 'r')
	json_obj = json.load(f)
	f.close()
	return json_obj

if __name__ == "__main__":
	main()