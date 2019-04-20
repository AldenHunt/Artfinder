 # usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun
import sqlite3, json, math, operator


def display_objects_table(db_file):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	conn.close()
	return rows
	
def display_object_data(db_file, objectid):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	row = cur.fetchone()
	conn.close()
	return row

def json_object_data(db_file, objectid):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_object('objectid', objectid, 'lat', lat, 'long', long) AS json_result FROM (SELECT * FROM objects WHERE objectid=?)", (objectid,))
	row = cur.fetchone()
	json_row = json.loads(row[0])
	conn.close()
	return json_row

def json_objects_table(db_file):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_group_array(json_object('objectid', objectid, 'lat', lat, 'long', long, 'title', title, 'creators', creators)) AS json_result FROM (SELECT * FROM objects)")
	rows = cur.fetchall()
	json_string = rows[0][0]
	json_object = json.loads(json_string)
	conn.close()
	return json_object
	
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
		cur.execute("SELECT json_group_array(json_object('objectid', objectid, 'lat', lat, 'long', long, 'title', title, 'creators', creators)) AS json_result FROM (SELECT * FROM objects WHERE objectid=?)", (objid,))
		rows = cur.fetchall()
		json_string = rows[0][0]
		json_object = json.loads(json_string)
		distance = sortedr[j][1]
		json_object[0]['dist'] = distance
		#cur.execute("SELECT * FROM objects WHERE objectid=?", (objid,))
		#r = dict((cur.description[i][0], val) for i, val in enumerate(cur.fetchall()[0]));
		results = results + json_object
	conn.close()
	results = json.dumps(results)
	return results
	