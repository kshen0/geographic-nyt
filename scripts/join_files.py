import json 
import jsonfiles
import sys

# usage: python join_files.py year segments

def main(argv):
	if len(argv) != 2 or int(argv[0]) < 1980:
		print "Invalid args: " + argv
		return

	year = int(argv[0])
	segments = int(argv[1])
	print "Joining %d files for %d" % (segments, year)
	output = []
	for i in xrange(1, segments + 1):
		filename = ("../json/output/nyt_articles_%s_%d.json" % 
					(str(year), i))
		r = jsonfiles.read(filename)
		print type(r)
		output = output + r
		print len(output)

	outfile_name = "../json/output/nyt_articles_%d_all.json" % year
	jsonfiles.write(outfile_name, output)

if __name__ == "__main__":
	main(sys.argv[1:])