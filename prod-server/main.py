from flask import Flask, render_template, request, g, session, redirect, send_from_directory
import urllib2
import re
import json
import UNSWData

app = Flask(__name__)
app.secret_key = 'B3Dvm1BJF1'

@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template("index.html")

@app.route('/get', methods=['GET', 'POST'])
def get():
	# open a data stream
	params = request.args
	ds = UNSWData.DataStream(params)
	err = ds.validateParams()
	if err != None:
		return json.dumps(err)
	# get request type
	req = params["type"]
	# handle request
	if(req == "facCodes"):
		# return a list of all fac codes for
		# given semester and year
		facCodes = list(map(lambda x: x[0], ds.getAllFaculties()))
		return json.dumps(facCodes)
	elif(req == "courseCodeValidty"):
		# Check if a given course code is valid
		if "courseCode" not in request.args:
			return json.dumps({"error": True, "error-msg": "Course code not specified"})
		arg = request.args["courseCode"]
		return json.dumps(ds.validateCourseCode(arg))
	else:
		# Unknown request type
		return json.dumps({"error": True, "error-msg": "Unknown Request Type"})

@app.route('/search', methods=['POST'])
def search():
	# open a data stream
	params = request.get_json()
	ds = UNSWData.DataStream(params)
	err = ds.validateParams()
	if err != None:
		return json.dumps(err)
	# do the search
	filters = request.get_json()
	return json.dumps(ds.courseSearch(filters))

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('', path)


if __name__ == "__main__":
	app.run(debug=True)