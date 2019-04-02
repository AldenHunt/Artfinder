# usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun
import sqlite3
import math

def display_objects_table(db_file):
	''' Displays all objects in the objects table of the db in the argument, printing them out and returning them as a list of lists.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	for row in rows:
		print(row)
	return rows
	conn.close()
	
def display_object_data(db_file, objectid):
	''' Returns an object with objectid as its object id from database db_file.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	row = cur.fetchall()
	#for row in rows:
	#	print(row)
	conn.close()
	return row
	
	
def display_by_radius(db_file, lat, long, radius):
	''' Returns a list of objects from database db_file within a radius of radius centered on lat long.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	results = []
	i = 0
	for row in rows:
		rlat = float(row[8])
		rlong = float(row[9])
		dist = math.sqrt((lat - rlat)**2 + (long - rlong)**2)
		if dist <= radius:
			results.append(row)
	conn.close()
	return results


# testing code
#display_by_radius("artobjects.db", 40.34, -74.65, 0.01)
