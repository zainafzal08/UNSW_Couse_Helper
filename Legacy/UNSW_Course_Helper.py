import sys
from flask import Flask, render_template, request, g, session, redirect
import time

class Table():
	def __init__(self):
		self.rows = []
		self.headings = []
	def addRow(self, r):
		self.rows.append(r)
	def addData(self, r, d):
		if r in self.rows:
			raise KeyError("Row "+r+" Doesn't Exist")
		self.rows[r].append(d)
	def addHeading(self, h):
		self.headings.append(h)

def handleRequest(request):
	if request.method == "GET" and len(request.args) == 0:
		return fetchDefaultPage(request)
	elif request.method == "POST":
		return handlePost(request)

def fetchDefaultPage(request):
	return render_template("unswCH.html", tag=str(time.time()))

def handlePost(request):
	return None


# Experimenting with a module system where modules request data
# from the server via a set interface

