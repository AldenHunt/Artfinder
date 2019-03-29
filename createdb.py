# createdb.py
# python suite to create database from Princeton Art Library Data
# Rhea Braun

# Added material and description columns, drop_table function March 29th - Sadie

import csv
from urllib.request import urlopen
import json
import sqlite3
from sqlite3 import Error
 
# from sqlite3 tutorials on www.sqlitetutorial.net
def create_connection(db_file):
    # create a database connection to a SQLite database 
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
    return None
 
def create_table(conn):
    # create a table from the create_table_sql statement
	create_table_sql = """ CREATE TABLE IF NOT EXISTS objects (
									objectid integer PRIMARY KEY,
									title text,
									creators text,
									dates text,
									description text,
									image text,
									medium text,
									dimensions text,
									lat real,
									long real
								); """
	try:
		c = conn.cursor()
		c.execute(create_table_sql)
		conn.commit()
	except Error as e:
		print(e)

def populate_table(conn):
	# load object ids and locations from csv
	# from python csv documentation example code
	insert = ''' INSERT INTO objects(objectid,title,lat,long)
              VALUES(?,?,?,?) '''
	with open('campus_art.csv', newline='') as f:
		reader = csv.reader(f)
		for row in reader:
			info = [int(row[0]), row[2], float(row[3]), float(row[4])]
			print(info)
			try:
				cur = conn.cursor()
				cur.execute(insert, info)
			except Error as e:
				print(e)
		conn.commit()

		
def update_table(conn):
	lib = "https://data.artmuseum.princeton.edu/objects/"
	update= ''' UPDATE objects
              SET creators = ? ,
                  dates = ? ,
                  description = ?,
                  image = ?,
				  medium = ?,
				  dimensions = ?
              WHERE objectid = ?'''
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	for row in rows:
		id = row[0]
		url = lib + str(id)
		info = json.loads(urlopen(url).read())
		try:
			makers = info["makers"][0]["displayname"]
			date = info["displaydate"]
			description = info["texts"][0]["textentryhtml"]
			image = info["media"][0]["uri"]
			medium = info["medium"]
			dimensions = info["dimensions"]
		except:
			image = ""
			print("missing data: " + str(id))
		info = [makers, date, description, image, medium, dimensions, id]
		#print(info)
		cur.execute(update, info)
	conn.commit()
		
def display_table(conn):
	cur = conn.cursor()
	cur.execute("SELECT * FROM objects")
	rows = cur.fetchall()
	for row in rows:
		print(row)

def drop_table(conn):
	cur = conn.cursor()
	cur.execute("DROP TABLE objects")
	conn.commit()

def main():
	database = "artobjects.db"

	# create a database connection
	conn = create_connection(database)
	if conn is not None:
		# remove existing table
		drop_table(conn)
		# create objects table
		create_table(conn)
		# add items
		populate_table(conn)
		update_table(conn)
		
		# display the created table
		display_table(conn)
		conn.close()
	else:
		print("Error! cannot create the database connection.")


	
# running this code with a preexisting database may cause unintended consequences	
main()