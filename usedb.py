 # usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun, Sadie Van Vranken
import sqlite3, json, math, operator

def display_objects_table(db_file):
	''' Displays all objects in the objects table of the db in the argument, printing them out and returning them as a list of lists.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	r = {};
	list = [];
	for row in cur.fetchall():
		r = dict((cur.description[i][0], val) for i, val in enumerate(row));
		list.append(r);
	#for row in rows:
		#print(row)
	conn.close()
	list = json.dumps(list)
	return list
	
def display_object_data(db_file, objectid):
	''' Returns an object with objectid as its object id from database db_file.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	rows = cur.fetchall()
	#for row in rows:
	#	print(row)
	conn.close()
	return rows


def display_by_radius(db_file, lat, long, radius):
	''' Returns a list of objects from database db_file within a radius of radius centered on lat long.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	r = {}
	results = []
	i = 0
	for row in rows:
		rlat = float(row[8])
		rlong = float(row[9])
		dist = math.sqrt((lat - rlat)**2 + (long - rlong)**2)
		if dist <= radius:
			r = dict((cur.description[i][0], val) for i, val in enumerate(row));
			results.append(r);
	conn.close()
	results = json.dumps(results)
	return results

def display_objects_location(db_file, lat, long, n):
	''' Returns a list of n objects from database db_file centered on lat long.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	unsorted = {}
	r = {}
	results = []
	i = 0
	for row in rows:
		rlat = float(row[8])
		rlong = float(row[9])
		dist = math.sqrt((lat - rlat)**2 + (long - rlong)**2)
		unsorted[row[0]] = dist
	sortedr = sorted(unsorted.items(), key=operator.itemgetter(1))
	for j in range(n):
		objid = sortedr[j][0]
		cur.execute("SELECT * FROM objects WHERE objectid=?", (objid,))
		r = dict((cur.description[i][0], val) for i, val in enumerate(cur.fetchall()[0]));
		results.append(r);
	conn.close()
	results = json.dumps(results)
	return results