from flask import Flask, url_for, render_template, request, make_response, Markup
from flask_sslify import SSLify
import usedb


app = Flask(__name__)
sslify = SSLify(app)

# This will be our splash page
@app.route('/')
def splash():
    return render_template('hello.html')

# This is our main map page
@app.route('/map')
def map():
    objects = usedb.json_objects_table('artobjects.db')
    return render_template('map.html', objects=objects)

# However we're going to display the full data about an object
@app.route('/objects/<int:obj_id>')
def show_object_data(obj_id):
    objdata = usedb.display_object_data('artobjects.db', obj_id)
    return render_template('objects.html', objdata=objdata)


