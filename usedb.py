 # usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun
import sqlite3, json


def display_objects_table(db_file):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	list = [];
	for row in cur.fetchall():
		r = dict((cur.description[i][0], val) for i, val in enumerate(row));
		list.append(r);
	#for row in rows:
		#print(row)
	conn.close()
	return list
	
def display_object_data(db_file, objectid):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	##rows = cur.fetchall()
	#for row in rows:
	#	print(row)
	conn.close()
	##return rows

def json_object_data(db_file, objectid):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT json_object('objectid', objectid, 'lat', lat, 'long', long) AS json_result FROM (SELECT * FROM objects WHERE objectid=?)", (objectid,))
	row = cur.fetchone()
	print row[0];
	conn.close()
	return row[0]

	