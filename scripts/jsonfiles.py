import json

def read(filename):
	f = open(filename, 'r')
	json_obj = json.load(f)
	f.close()
	return json_obj

def write(filename, output):
	with open(filename, "w") as outfile:
		json.dump(output, outfile, indent=4)
		print "Wrote to %s" % (filename)

def write_min(filename, output):
	with open(filename, "w") as outfile:
		json.dump(output, outfile)
