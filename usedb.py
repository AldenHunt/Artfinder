 # usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun
import sqlite3, json


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
	print (row[0]);
	print (type (row))
	json_row = json.loads(row[0])
	print (json_row)
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
	