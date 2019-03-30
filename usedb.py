# usedb.py
# a collection of sql methods to return data from the database
# untested
# Rhea Braun
import sqlite3

def display_objects_table(db_file):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	for row in rows:
		print(row)
	conn.close()
	
def display_object_data(db_file, objectid):
	conn = sqlite3.connect(db_file)
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects WHERE objectid=?", (objectid,))
	row = cur.fetchall()
	#for row in rows:
	#	print(row)
	conn.close()
	return row