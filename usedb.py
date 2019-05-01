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
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	row = cur.fetchone()
	conn.close()
	return row

def json_object_data(db_file, objectid):
	''' Returns an object with objectid as its object id from database db_file in json format.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_object('objectid', objectid, 'lat', lat, 'long', long) AS json_result FROM (SELECT * FROM objects WHERE objectid=?)", (objectid,))
	row = cur.fetchone()
	json_row = json.loads(row[0])
	conn.close()
	return json_row

def json_objects_table(db_file):
	''' Displays all objects in the objects table of the db in the argument, printing them out and returning them as a list of lists.'''
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_group_array(json_object('objectid', objectid, 'lat', lat, 'long', long, 'title', title, 'creators', creators, 'image', image)) AS json_result FROM (SELECT * FROM objects)")
	rows = cur.fetchall()
	json_string = rows[0][0]
	json_object = json.loads(json_string)
	conn.close()
	return json_object
	
def dist_ltf(lat, long, rlat, rlong):
	lat2ft = 353760
	long2ft = 278842
	dist = math.sqrt(((lat - rlat)*lat2ft)**2 + ((long - rlong)*long2ft)**2)
	return dist
	
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
		dist = dist_ltf(lat, long, rlat, rlong)
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
		dist = dist_ltf(lat, long, rlat, rlong)
		unsorted[row[0]] = dist
	sortedr = sorted(unsorted.items(), key=operator.itemgetter(1))
	for j in range(n):
		objid = sortedr[j][0]
		cur.execute("SELECT json_group_array(json_object('objectid', objectid, 'lat', lat, 'long', long, 'title', title, 'creators', creators, 'image', image)) AS json_result FROM (SELECT * FROM objects WHERE objectid=?)", (objid,))
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
	
def json_search(db_file, string):
	key = '%' + string + '%'
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_group_array(json_object('objectid', objectid, 'lat', lat, 'long', long, 'title', title, 'creators', creators, 'image', image)) AS json_result FROM (SELECT * FROM  objects WHERE title LIKE ? OR creators LIKE ? OR dates LIKE ? OR description LIKE ?)", (key, key, key, key,))
	rows = cur.fetchall()
	json_string = rows[0][0]
	json_object = json.loads(json_string)
	conn.close()
	return json_object
	
# def json_search(db_file, string):
	#hits = objects_search(db_file, string)
	#result = [];
	#for objid in hits:
		#print(hits[0][0])
		#result += json_object_data(db_file, hits[0][0])
	#return json.dumps(result) 
	